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
                    String tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
                    var tokenResponse = webClientBuilder.build()
                        .post()
                        .uri(tokenUrl)
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .bodyValue(String.format(
                            "grant_type=client_credentials&client_id=%s&client_secret=%s",
                            clientId, clientSecret))
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                    JsonObject tokenJson = JsonParser.parseString(tokenResponse).getAsJsonObject();
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
                    log.error("Failed to fetch LinkedIn job postings: {}", e.getMessage());
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

    public record LinkedInJobPosting(
        String id,
        String title,
        String description,
        String formattedLocation,
        String companyId,
        String applicationUrl,
        boolean isRemote
    ) {}
} 
