package cx.flamingo.analysis.service;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.model.JobOpening;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LinkedInService {

    private final CacheServiceAbs cacheService;
    private final WebClient.Builder webClientBuilder;
    private final Gson gson;

    @Value("${linkedin.client.id}")
    private String clientId;

    @Value("${linkedin.client.secret}")
    private String clientSecret;

    @Value("${linkedin.organization.id}")
    private String organizationId;

    @Value("${linkedin.cache.refresh.interval:3600000}")
    private Long refreshInterval;

    private static final String CACHE_PATH = "linkedin";
    private static final String BASE_URL = "https://api.linkedin.com/v2";

    public LinkedInService(
            CacheServiceAbs cacheService,
            WebClient.Builder webClientBuilder) {
        this.cacheService = cacheService;
        this.webClientBuilder = webClientBuilder;
        this.gson = new GsonBuilder().create();
    }

    public List<JobOpening> getCompanyJobPostings() {
        String cacheKey = String.format("jobs_%s", organizationId);

        return cacheService.get(CACHE_PATH, cacheKey, new TypeToken<List<JobOpening>>() {}, refreshInterval)
            .orElseGet(() -> {
                try {
                    // First get an access token
                    // NOTE: client_credentials grant does not provide access to
                    // /v2/organizations/{id}/updates — a member-authorized token with
                    // r_organization_social scope is required. This will consistently
                    // return 401/403 from LinkedIn until the auth flow is corrected.
                    String tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
                    String tokenBody = "grant_type=client_credentials&client_id="
                        + clientId
                        + "&client_secret="
                        + clientSecret;
                    var tokenResponse = webClientBuilder.build()
                        .post()
                        .uri(tokenUrl)
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .bodyValue(tokenBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                    if (tokenResponse == null) {
                        log.error("Failed to fetch LinkedIn job postings: token response was null");
                        return List.of();
                    }

                    JsonObject tokenJson = JsonParser.parseString(tokenResponse).getAsJsonObject();
                    if (!tokenJson.has("access_token") || tokenJson.get("access_token").isJsonNull()) {
                        log.error("Failed to fetch LinkedIn job postings: access_token missing from token response");
                        return List.of();
                    }
                    String accessToken = tokenJson.get("access_token").getAsString();

                    // Then get the organization's updates which include job postings
                    String updatesUrl = String.format("%s/organizations/%s/updates", BASE_URL, organizationId);
                    var response = webClientBuilder.build()
                        .get()
                        .uri(updatesUrl)
                        .header("Authorization", "Bearer " + accessToken)
                        .retrieve()
                        .bodyToMono(String.class)
                        .timeout(Duration.ofSeconds(10))
                        .block();

                    if (response == null) {
                        log.error("Failed to fetch LinkedIn job postings: updates response was null");
                        return List.of();
                    }

                    JsonObject jsonResponse = JsonParser.parseString(response).getAsJsonObject();
                    
                    // Filter for job posting updates
                    List<JobOpening> jobs = jsonResponse.getAsJsonArray("elements").asList().stream()
                        .filter(element -> {
                            JsonObject update = element.getAsJsonObject();
                            return update.has("content") && 
                                   update.getAsJsonObject("content").has("jobPosting");
                        })
                        .map(element -> {
                            JsonObject jobPosting = element.getAsJsonObject()
                                .getAsJsonObject("content")
                                .getAsJsonObject("jobPosting");
                            return JobOpening.builder()
                                .id(jobPosting.get("id").getAsString())
                                .title(jobPosting.get("title").getAsString())
                                .location(extractLocation(jobPosting))
                                .url(String.format("https://www.linkedin.com/jobs/view/%s", 
                                    jobPosting.get("id").getAsString()))
                                .build();
                        })
                        .toList();
                    
                    cacheService.put(CACHE_PATH, cacheKey, jobs);
                    return jobs;

                } catch (Exception e) {
                    log.error("Failed to fetch LinkedIn job postings", e);
                    return List.of();
                }
            });
    }

    private String extractLocation(JsonObject job) {
        try {
            if (job.has("formattedLocation")) {
                return job.get("formattedLocation").getAsString();
            }
            
            if (job.has("location")) {
                JsonObject location = job.getAsJsonObject("location");
                if (location.has("country") && location.has("city")) {
                    return String.format("%s, %s", 
                        location.get("city").getAsString(),
                        location.get("country").getAsString());
                }
            }
            
            return "Remote";
        } catch (Exception e) {
            return "Remote";
        }
    }
} 
