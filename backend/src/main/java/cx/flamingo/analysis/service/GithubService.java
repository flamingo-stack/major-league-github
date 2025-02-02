package cx.flamingo.analysis.service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.stream.Collectors;

import org.javatuples.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.exception.GithubGeneralException;
import cx.flamingo.analysis.exception.GithubRateLimitException;
import cx.flamingo.analysis.exception.GithubTimeoutException;
import cx.flamingo.analysis.exception.GithubTooFastException;
import cx.flamingo.analysis.graphql.GitHubQueryBuilder;
import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Contributor;
import cx.flamingo.analysis.model.Language;
import cx.flamingo.analysis.model.SocialLink;
import cx.flamingo.analysis.rate.GithubToken;
import cx.flamingo.analysis.rate.GithubTokenRateManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GithubService {

    private Integer githubApiConcurrency;

    private final CacheServiceAbs cacheService;
    private final Gson gson;

    private final CityService cityService;
    private final LanguageService languageService;
    private final GithubTokenRateManager githubTokenRateManager;

    @Autowired
    private SoccerTeamService soccerTeamService;

    private ThreadPoolExecutor contributorsAsyncExecutorLow;
    private ThreadPoolExecutor contributorsAsyncExecutorHigh;

    public enum GithubApiPriority {
        Low,
        High;
    }

    public GithubService(
            CacheServiceAbs cacheService,
            CityService cityService,
            LanguageService languageService,
            GithubTokenRateManager githubTokenRateManager,
            @Qualifier("contributorsAsyncExecutorLow") ThreadPoolExecutor contributorsAsyncExecutorLow,
            @Qualifier("contributorsAsyncExecutorHigh") ThreadPoolExecutor contributorsAsyncExecutorHigh,
            @Value("${github.api.concurrency:10}") Integer githubApiConcurrency) {
        this.cacheService = cacheService;
        this.gson = new GsonBuilder().create();
        this.cityService = cityService;
        this.languageService = languageService;
        this.githubTokenRateManager = githubTokenRateManager;
        this.contributorsAsyncExecutorLow = contributorsAsyncExecutorLow;
        this.contributorsAsyncExecutorHigh = contributorsAsyncExecutorHigh;
        this.githubApiConcurrency = githubApiConcurrency;
    }

    public List<Contributor> getTopContributorsIn(List<City> cities, Language language, int maxResults,
            GithubApiPriority priority) {
        if (language == null) {
            throw new IllegalArgumentException("Language cannot be null");
        }

        Map<String, Contributor> contributorsByLogin = new HashMap<>();

        // Process cities in batches
        for (int i = 0; i < cities.size(); i += githubApiConcurrency) {
            int end = Math.min(i + githubApiConcurrency, cities.size());
            List<City> batch = cities.subList(i, end);

            // Create a list to hold the futures for this batch
            List<CompletableFuture<List<Contributor>>> futures = batch.stream()
                    .map(city -> CompletableFuture.supplyAsync(() -> {
                        try {
                            log.info("Fetching {} {} contributors for city: {}", maxResults, language.getName(),
                                    city.getName());
                            List<Contributor> contributors = getContributorsForCity(city, language, maxResults);
                            log.info("Found {} {} contributors for city: {}", contributors.size(), language.getName(),
                                    city.getName());

                            for (Contributor contributor : contributors) {
                                if (contributor.getSocialLinks() == null || contributor.getSocialLinks().isEmpty()) {
                                    log.debug("No social links found for contributor: {}", contributor.getLogin());  
                                    continue;
                                }
                                for (SocialLink socialLink : contributor.getSocialLinks()) {
                                    log.debug("Social Link: {}", socialLink.getUrl());
                                }
                            }
                            return contributors;
                        } catch (Exception e) {
                            log.error("Failed to fetch contributors for city {}: {}", city.getName(), e.getMessage());
                            return new ArrayList<Contributor>();
                        }
                    }, priority == GithubApiPriority.High ? contributorsAsyncExecutorHigh
                            : contributorsAsyncExecutorLow))
                    .collect(Collectors.toList());

            // Wait for all futures in this batch to complete
            try {
                CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                        .exceptionally(throwable -> {
                            log.error("Error in batch processing: {}", throwable.getMessage());
                            return null;
                        })
                        .join();

                // Collect results from this batch
                futures.stream()
                        .map(future -> {
                            try {
                                return future.join();
                            } catch (Exception e) {
                                log.error("Error collecting future result: {}", e.getMessage());
                                return new ArrayList<Contributor>();
                            }
                        })
                        .flatMap(List::stream)
                        .forEach(contributor -> {
                            // Keep the contributor with the highest score if duplicate
                            contributorsByLogin.merge(contributor.getLogin(), contributor,
                                    (existing, newContributor) -> existing.getScore() >= newContributor.getScore()
                                            ? existing
                                            : newContributor);
                        });
            } catch (Exception e) {
                log.error("Error processing batch: {}", e.getMessage());
            }
        }

        // Sort and limit results
        return contributorsByLogin.values().stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(maxResults)
                .collect(Collectors.toList());
    }

    public List<Contributor> getContributorsForCity(City city, Language language, int maxResults) {
        // Input validation
        if (city == null) {
            throw new IllegalArgumentException("City cannot be null");
        }
        if (language == null) {
            throw new IllegalArgumentException("Language cannot be null");
        }
        if (maxResults <= 0) {
            throw new IllegalArgumentException("maxResults must be greater than 0");
        }

        List<Contributor> contributors = new ArrayList<>();
        String cursor = null;
        boolean hasNextPage = true;
        int pageCount = 1;
        int numberOfUsers = maxResults;
        int maxRetries = 10;

        while (hasNextPage && contributors.size() < maxResults && maxRetries > 0) {
            log.debug("Fetching page {} for {} contributors in {}",
                    pageCount, language.getName(), city.getName());

            String query = buildGitHubQuery(cursor, city, language, numberOfUsers);
            if (log.isDebugEnabled()) {
                log.debug("GraphQL Query:\n{}", query);
            }
            JsonObject response = null;

            try {
                response = executeGraphQLQuery(query, language.getName(), pageCount, city);
            } catch (GithubTimeoutException th) {
                numberOfUsers = Math.max(1, numberOfUsers / 3);
                log.warn("Timeout occurred, will reduce the return size to {} users", numberOfUsers);

                continue;
            } catch (GithubRateLimitException th) {
                log.warn("Rate limit exceeded, switching to next token");
                // it will try another token anyway as defined in @githubTokenRateManager
                continue;
            } catch (GithubTooFastException th) {
                log.warn("Token might be invalid or expired, or too fast");
                maxRetries--;
                continue;
            } catch (GithubGeneralException th) {
                log.info("Error executing GraphQL query: {}", th.getMessage());
            } catch (Throwable th) {
                log.error("Error executing GraphQL query: {}", th.getMessage(), th);
                maxRetries--;
                continue;
            }

            if (response == null || !response.has("data")) {
                numberOfUsers = Math.max(1, numberOfUsers / 3);
                maxRetries--;
                log.warn(
                        "No data in response for city: {} and language: {}, will retry. Retries left: {}, number of users: {}",
                        city.getName(), language.getName(), maxRetries, numberOfUsers);
                continue;
            }

            JsonObject search = response.getAsJsonObject("data")
                    .getAsJsonObject("search");

            List<Contributor> tempContributors = new ArrayList<>();
            processUsers(search.getAsJsonArray("nodes"), tempContributors, city);
            contributors.addAll(tempContributors);
            log.debug("Found {} {} contributors on page {}", tempContributors.size(), language.getName(),
                    pageCount + 1);

            JsonObject pageInfo = search.getAsJsonObject("pageInfo");
            hasNextPage = pageInfo.get("hasNextPage").getAsBoolean();
            JsonElement endCursor = pageInfo.get("endCursor");
            cursor = endCursor.isJsonNull() ? null : endCursor.getAsString();

            if (contributors.size() >= maxResults) {
                log.debug("Reached maximum results ({}) for city: {}", maxResults, city.getName());
                break;
            }
            maxRetries = 10;
            numberOfUsers = maxResults;
            pageCount = pageCount + 1;
        }

        return contributors;
    }

    private JsonObject executeGraphQLQuery(String query, String language, int pageNumber, City city)
            throws GithubTimeoutException, GithubRateLimitException {
        githubTokenRateManager.initializeRateLimits();
        if (log.isDebugEnabled()) {
            log.debug("Raw GraphQL Query:\n{}", query);
        }

        JsonObject queryJson = new JsonObject();
        queryJson.addProperty("query", query);
        String jsonBody = gson.toJson(queryJson);
        if (log.isDebugEnabled()) {
            log.debug("JSON Body:\n{}", jsonBody);
        }

        return cacheService.getGitHubApiResponse(city, language, pageNumber, () -> {
            try {
                Pair<WebClient, GithubToken> webClientToGithubToken = githubTokenRateManager.getBestAvailableClient();
                JsonObject response = webClientToGithubToken.getValue0().post()
                        .bodyValue(jsonBody)
                        .retrieve()
                        .onStatus(status -> status.value() == 403,
                                clientResponse -> {
                                    List<String> retryAfterHeaders = clientResponse.headers().header("retry-after");
                                    String retryAfter = !retryAfterHeaders.isEmpty() ? retryAfterHeaders.get(0) : null;
                                    if (retryAfter != null) {
                                        GithubToken token = webClientToGithubToken.getValue1();
                                        githubTokenRateManager.updateTokenRateLimits(token,
                                                clientResponse.headers().asHttpHeaders());
                                        log.error("Secondary rate limit hit. Retry after {} seconds", retryAfter);
                                    }
                                    throw new GithubTooFastException("Token might be invalid or expired, or too fast");
                                })
                        .toEntity(String.class)
                        .timeout(Duration.ofSeconds(10))
                        .map(responseEntity -> {
                            // Update token rate limits from response headers
                            GithubToken token = webClientToGithubToken.getValue1();
                            githubTokenRateManager.updateTokenRateLimits(token, responseEntity.getHeaders());

                            String responseStr = responseEntity.getBody();
                            JsonObject jsonResponse = JsonParser.parseString(responseStr).getAsJsonObject();
                            if (jsonResponse.has("errors")) {
                                JsonArray errors = jsonResponse.getAsJsonArray("errors");
                                for (JsonElement error : errors) {
                                    String message = error.getAsJsonObject().get("message").getAsString();
                                    if (message.contains("rate limit")) {
                                        throw new GithubRateLimitException(
                                                "Rate limit exceeded, switching to next token");
                                    }
                                    if (message.contains("timeout")) {
                                        throw new GithubTimeoutException(
                                                "Timeout occurred, will reduce the return size");
                                    }
                                    if (message.contains("forbidden")) {
                                        throw new GithubTooFastException(
                                                "Token might be invalid or expired, or too fast");
                                    }
                                    log.warn("GitHub API error: {}", message);
                                }
                            }

                            // Check if it's an empty response
                            boolean isEmpty = !jsonResponse.has("data")
                                    || jsonResponse.get("data").isJsonNull()
                                    || (jsonResponse.getAsJsonObject("data").has("search")
                                            && jsonResponse.getAsJsonObject("data")
                                                    .getAsJsonObject("search")
                                                    .getAsJsonArray("nodes")
                                                    .size() == 0);
                            if (isEmpty) {
                                log.info("Empty response for city: {}, will cache to avoid future API calls",
                                        city.getName());
                            }

                            return jsonResponse;
                        })
                        .block();

                return response;
            } catch (Throwable th) {
                String errorMessage = th.getMessage();

                boolean isTimeout = errorMessage != null
                        && (errorMessage.contains("timeout") || errorMessage.contains("Timeout"));

                boolean isRateLimit = errorMessage != null && errorMessage.contains("rate limit");

                boolean isForbidden = errorMessage != null && errorMessage.contains("forbidden");

                if (isTimeout) {
                    throw new GithubTimeoutException("Timeout occurred, will reduce the return size", th);
                }
                if (isRateLimit) {
                    throw new GithubRateLimitException("Rate limit exceeded, switching to next token", th);
                }

                if (isForbidden) {
                    throw new GithubTooFastException("Token might be invalid or expired, or too fast", th);
                }

                throw th;
            }
        }).orElseThrow(() -> new GithubGeneralException(
                String.format("No data returned for city: %s, language: %s, page: %d",
                        city.getName(), language, pageNumber)));
    }

    private String buildGitHubQuery(String cursor, City city, Language language, Integer numberOfUsers) {
        GitHubQueryBuilder builder = new GitHubQueryBuilder();
        String query = builder.searchUsers(numberOfUsers)
                .location(city.getName())
                .language(language.getName())
                .cursor(cursor)
                .build();
        log.debug("Generated GitHub query for city {}: {}", city.getName(), query);
        return query;
    }

    private void processUsers(JsonArray users, List<Contributor> contributors, City city) {
        for (JsonElement userElement : users) {
            if (!userElement.isJsonNull()) {
                JsonObject user = userElement.getAsJsonObject();
                try {
                    Contributor contributor = fetchUserProfile(
                        getStringOrDefault(user, "login", ""),
                        Contributor.Role.CONTRIBUTOR,
                        user
                    );
                    
                    // Override location-specific fields since we know them
                    contributor = contributor.toBuilder()
                        .cityId(city.getId())
                        .nearestTeamId(soccerTeamService.findNearestTeamId(city))
                        .city(city)
                        .nearestTeam(soccerTeamService.getTeamById(soccerTeamService.findNearestTeamId(city)))
                        .build();
                    
                    contributors.add(contributor);
                } catch (Exception e) {
                    log.error("Failed to process user: {}", e.getMessage());
                }
            }
        }
    }

    private double calculateScore(int commits, long javaRepos, int starsReceived,
            int forks, int starsGiven, int forksGiven, Instant latestCommit) {
        // Calculate recency multiplier (1.0 to 2.0)
        double recency = 1.0;
        if (latestCommit != null) {
            // Get the timestamp for 1 year ago
            Instant oneYearAgo = Instant.now().minus(365, ChronoUnit.DAYS);

            // Calculate how recent the commit is as a percentage of a year
            double daysFromYearAgo = (latestCommit.getEpochSecond() - oneYearAgo.getEpochSecond())
                    / (365.0 * 24 * 60 * 60);

            // Map to range 1.0 to 2.0
            recency = 1.0 + Math.max(0, Math.min(1.0, daysFromYearAgo));
        }

        // Calculate final score using formula: commits × max(stars, 1) × recency
        return Math.round(commits * Math.max(starsReceived, 1) * recency);
    }

    private long countJavaRepositories(JsonArray repositories) {
        return repositories.asList().stream()
                .filter(repo -> repo.getAsJsonObject().has("primaryLanguage")
                        && !repo.getAsJsonObject().get("primaryLanguage").isJsonNull()
                        && repo.getAsJsonObject().getAsJsonObject("primaryLanguage")
                                .get("name").getAsString().equals("Java"))
                .count();
    }

    private int calculateTotalStars(JsonArray repositories) {
        return repositories.asList().stream()
                .mapToInt(repo -> repo.getAsJsonObject().get("stargazerCount").getAsInt())
                .sum();
    }

    private int calculateTotalForks(JsonArray repositories) {
        return repositories.asList().stream()
                .mapToInt(repo -> repo.getAsJsonObject().get("forkCount").getAsInt())
                .sum();
    }

    private int calculateStarsReceived(JsonArray repositories) {
        return repositories.asList().stream()
                .filter(repo -> {
                    JsonObject repoObj = repo.getAsJsonObject();
                    return repoObj.has("primaryLanguage")
                            && !repoObj.get("primaryLanguage").isJsonNull()
                            && repoObj.getAsJsonObject("primaryLanguage")
                                    .get("name").getAsString().equals("Java");
                })
                .mapToInt(repo -> repo.getAsJsonObject().get("stargazerCount").getAsInt())
                .sum();
    }

    private String getStringOrDefault(JsonObject obj, String field, String defaultValue) {
        return obj.has(field) && !obj.get(field).isJsonNull()
                ? obj.get(field).getAsString()
                : defaultValue;
    }

    private int getContributionCount(JsonObject user) {
        if (user.has("contributionsCollection")) {
            JsonObject contributions = user.getAsJsonObject("contributionsCollection");
            return contributions.get("totalCommitContributions").getAsInt();
        }
        return 0;
    }

    private Instant getLatestCommitDate(JsonObject user) {
        if (!user.has("contributionsCollection")) {
            return null;
        }
        JsonObject contributions = user.getAsJsonObject("contributionsCollection");
        
        if (!contributions.has("contributionCalendar")) {
            return null;
        }

        JsonObject calendar = contributions.getAsJsonObject("contributionCalendar");
        JsonArray weeks = calendar.getAsJsonArray("weeks");

        String latestDate = null;
        for (JsonElement weekElement : weeks) {
            JsonObject week = weekElement.getAsJsonObject();
            JsonArray days = week.getAsJsonArray("contributionDays");
            for (JsonElement dayElement : days) {
                JsonObject day = dayElement.getAsJsonObject();
                if (day.get("contributionCount").getAsInt() > 0) {
                    latestDate = day.get("date").getAsString();
                }
            }
        }

        return latestDate != null ? Instant.parse(latestDate + "T00:00:00Z") : null;
    }

    private int getStarsGiven(JsonObject user) {
        if (user.has("starredRepositories")) {
            JsonObject starred = user.getAsJsonObject("starredRepositories");
            return starred.get("totalCount").getAsInt();
        }
        return 0;
    }

    private int getForksGiven(JsonObject user) {
        if (user.has("forkedRepos")) {
            JsonObject repos = user.getAsJsonObject("forkedRepos");
            if (repos.has("totalCount")) {
                return repos.get("totalCount").getAsInt();
            }
        }
        return 0;
    }

    public record GitHubProfile(
        String login,
        String id,
        String node_id,
        String avatar_url,
        String gravatar_id,
        String url,
        String html_url,
        String followers_url,
        String following_url,
        String gists_url,
        String starred_url,
        String subscriptions_url,
        String organizations_url,
        String repos_url,
        String events_url,
        String received_events_url,
        String type,
        String user_view_type,
        boolean site_admin,
        String name,
        String company,
        String blog,
        String location,
        String email,
        Boolean hireable,
        String bio,
        String twitter_username,
        int public_repos,
        int public_gists,
        int followers,
        int following,
        String created_at,
        String updated_at,
        int private_gists,
        int total_private_repos,
        int owned_private_repos,
        int disk_usage,
        int collaborators,
        boolean two_factor_authentication
    ) {}

    public Contributor fetchUserProfile(String username, Contributor.Role role, JsonObject existingData) {
        JsonObject userData;
        
        if (existingData != null) {
            // Use existing data (from bulk query)
            userData = existingData;
        } else {
            // Make new API calls only if we don't have existing data
            // First get the basic profile info using REST API
            String githubApiUrl = String.format("https://api.github.com/users/%s", username);
            
            Pair<WebClient, GithubToken> webClientToGithubToken = githubTokenRateManager.getBestAvailableClient();
            var response = webClientToGithubToken.getValue0().get()
                .uri(githubApiUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            GitHubProfile githubProfile = gson.fromJson(response, GitHubProfile.class);
            
            // Then get detailed stats using GraphQL
            String graphqlQuery = """
                query {
                  user(login: "%s") {
                    login
                    name
                    bio
                    avatarUrl
                    email
                    websiteUrl
                    twitterUsername
                    location
                    contributionsCollection {
                      totalCommitContributions
                      totalPullRequestContributions
                      totalIssueContributions
                      totalRepositoryContributions
                      contributionCalendar {
                        weeks {
                          contributionDays {
                            contributionCount
                            date
                          }
                        }
                      }
                    }
                    starredRepositories {
                      totalCount
                    }
                    forkedRepos: repositories(isFork: true) {
                      totalCount
                    }
                    originalRepos: repositories(first: 100, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
                      nodes {
                        stargazerCount
                        forkCount
                        primaryLanguage {
                          name
                        }
                      }
                    }
                    socialAccounts(first: 10) {
                      nodes {
                        provider
                        url
                      }
                    }
                  }
                }
            """.formatted(username);

            JsonObject queryJson = new JsonObject();
            queryJson.addProperty("query", graphqlQuery);
            
            var graphqlResponse = webClientToGithubToken.getValue0().post()
                .bodyValue(gson.toJson(queryJson))
                .retrieve()
                .bodyToMono(String.class)
                .block();

            JsonObject jsonResponse = JsonParser.parseString(graphqlResponse).getAsJsonObject();
            userData = jsonResponse.getAsJsonObject("data").getAsJsonObject("user");
        }

        // Process the data using shared logic
        JsonObject reposObj = userData.getAsJsonObject("originalRepos");
        if (reposObj == null || !reposObj.has("nodes")) {
            throw new IllegalStateException("No repository data available for user: " + username);
        }

        JsonArray repositories = reposObj.getAsJsonArray("nodes");
        long javaRepos = countJavaRepositories(repositories);
        int starsGiven = getStarsGiven(userData);
        int forksGiven = getForksGiven(userData);
        int starsReceived = calculateStarsReceived(repositories);
        int totalCommits = getContributionCount(userData);
        int totalForks = calculateTotalForks(repositories);
        Instant latestCommit = getLatestCommitDate(userData);

        double score = calculateScore(
                totalCommits,
                javaRepos,
                starsReceived,
                totalForks,
                starsGiven,
                forksGiven,
                latestCommit);

        // Extract bio and job role
        String bio = getStringOrDefault(userData, "bio", "");
        String jobRole = "Software Engineer";
        if (!bio.isEmpty()) {
            String[] bioLines = bio.split("\n", 2);
            if (bioLines.length > 0) {
                jobRole = bioLines[0].trim();
                if (bioLines.length > 1) {
                    bio = bioLines[1].trim();
                }
            }
        }

        // Build social links
        List<SocialLink> socialLinks = new ArrayList<>();
        
        // Add GitHub profile link
        socialLinks.add(SocialLink.builder()
            .platform("github")
            .url("https://github.com/" + getStringOrDefault(userData, "login", ""))
            .build());
        
        // Add email if available
        String email = getStringOrDefault(userData, "email", "");
        if (!email.isEmpty()) {
            socialLinks.add(SocialLink.builder()
                .platform("email")
                .url("mailto:" + email)
                .build());
        }

        // Add website if available
        String website = getStringOrDefault(userData, "websiteUrl", "");
        if (!website.isEmpty()) {
            String platform = determineWebsitePlatform(website);
            socialLinks.add(SocialLink.builder()
                .platform(platform)
                .url(website)
                .build());
        }

        // Add Twitter if available
        String twitterUsername = getStringOrDefault(userData, "twitterUsername", "");
        if (!twitterUsername.isEmpty()) {
            socialLinks.add(SocialLink.builder()
                .platform("twitter")
                .url("https://twitter.com/" + twitterUsername)
                .build());
        }

        // Add social accounts from GitHub API
        if (userData.has("socialAccounts") && !userData.get("socialAccounts").isJsonNull()) {
            JsonObject socialAccounts = userData.getAsJsonObject("socialAccounts");
            if (socialAccounts.has("nodes") && !socialAccounts.get("nodes").isJsonNull()) {
                JsonArray nodes = socialAccounts.getAsJsonArray("nodes");
                for (JsonElement account : nodes) {
                    if (!account.isJsonNull()) {
                        JsonObject accountObj = account.getAsJsonObject();
                        String provider = accountObj.get("provider").getAsString().toLowerCase();
                        String url = accountObj.get("url").getAsString();
                        
                        socialLinks.add(SocialLink.builder()
                            .platform(provider)
                            .url(url)
                            .build());
                    }
                }
            }
        }

        // Try to find city based on location
        City city = null;
        String cityId = null;
        String nearestTeamId = null;
        if (userData.has("location") && !userData.get("location").isJsonNull()) {
            String location = userData.get("location").getAsString();
            List<City> cities = cityService.autocompleteCities(location, null, null, null);
            if (!cities.isEmpty()) {
                city = cities.get(0);  // Use the first matching city
                cityId = city.getId();
                nearestTeamId = soccerTeamService.findNearestTeamId(city);
            }
        }

        Contributor.ContributorBuilder builder = Contributor.builder()
            .type(role)
            .login(getStringOrDefault(userData, "login", ""))
            .name(getStringOrDefault(userData, "name", "Unknown"))
            .avatarUrl(getStringOrDefault(userData, "avatarUrl", ""))
            .url(getStringOrDefault(userData, "url", ""))
            .email(email)
            .role(jobRole)
            .bio(bio)
            .socialLinks(socialLinks)
            .cityId(cityId)
            .nearestTeamId(nearestTeamId)
            .city(city)
            .nearestTeam(nearestTeamId != null ? soccerTeamService.getTeamById(nearestTeamId) : null);

        // Set stats based on role
        if (role == Contributor.Role.HIRING_MANAGER) {
            Map<String, Integer> stats = new HashMap<>();
            stats.put("score", (int) score);
            stats.put("totalCommits", totalCommits);
            stats.put("javaRepos", (int) javaRepos);
            stats.put("starsReceived", starsReceived);
            stats.put("forksReceived", totalForks);
            stats.put("starsGiven", starsGiven);
            stats.put("forksGiven", forksGiven);
            
            if (userData.has("contributionsCollection")) {
                JsonObject contributions = userData.getAsJsonObject("contributionsCollection");
                stats.put("totalPullRequests", contributions.get("totalPullRequestContributions").getAsInt());
                stats.put("totalIssues", contributions.get("totalIssueContributions").getAsInt());
            }
            
            builder.githubStats(stats)
                  .lastActive(latestCommit);
        } else {
            builder.totalCommits(totalCommits)
                  .javaRepos((int) javaRepos)
                  .starsReceived(starsReceived)
                  .forksReceived(totalForks)
                  .starsGiven(starsGiven)
                  .forksGiven(forksGiven)
                  .score((int) score)
                  .lastActive(latestCommit);
        }

        return builder.build();
    }

    // Update the old method to use the new one
    public Contributor fetchUserProfile(String username, Contributor.Role role) {
        return fetchUserProfile(username, role, null);
    }

    private String determineWebsitePlatform(String url) {
        url = url.toLowerCase();
        if (url.contains("linkedin.com")) return "linkedin";
        if (url.contains("instagram.com")) return "instagram";
        if (url.contains("twitter.com") || url.contains("x.com")) return "twitter";
        if (url.contains("facebook.com")) return "facebook";
        if (url.contains("github.com")) return "github";
        return "website";
    }
}
