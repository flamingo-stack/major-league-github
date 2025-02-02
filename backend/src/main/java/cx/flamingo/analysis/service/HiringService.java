package cx.flamingo.analysis.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.reflect.TypeToken;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.model.Contributor;
import cx.flamingo.analysis.model.HiringManagerProfile;
import cx.flamingo.analysis.model.JobOpening;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HiringService {

    private final GithubService githubService;
    private final LinkedInService linkedInService;
    private final CacheServiceAbs cacheService;

    @Value("${github.username}")
    private String githubUsername;

    @Value("${github.cache.refresh.interval}")
    private Long refreshInterval;

    private static final String CACHE_PATH = "hiring";
    private static final String PROFILE_KEY = "manager_profile";
    private static final String JOBS_KEY = "job_openings";

    public Map<String, Object> getHiringManagerProfile() {
        Map<String, Object> response = new HashMap<>();
        HiringManagerProfile profile = cacheService.get(CACHE_PATH, PROFILE_KEY, new TypeToken<HiringManagerProfile>() {
        }, refreshInterval)
                .orElseGet(() -> {
                    Contributor contributor = githubService.fetchUserProfile(githubUsername, Contributor.Role.HIRING_MANAGER);
                    HiringManagerProfile newProfile = HiringManagerProfile.builder()
                        .name(contributor.getName())
                        .avatarUrl(contributor.getAvatarUrl())
                        .role(contributor.getRole())
                        .bio(contributor.getBio())
                        .socialLinks(contributor.getSocialLinks())
                        .githubStats(contributor.getGithubStats())
                        .lastActive(contributor.getLastActive())
                        .build();
                    cacheService.put(CACHE_PATH, PROFILE_KEY, newProfile);
                    return newProfile;
                });
        
        response.put("status", "success");
        response.put("message", "Hiring manager profile retrieved successfully");
        response.put("data", profile);
        return response;
    }

    public List<JobOpening> getJobOpenings() {
        return cacheService.get(CACHE_PATH, JOBS_KEY, new TypeToken<List<JobOpening>>() {}, refreshInterval)
            .orElseGet(() -> {
                List<JobOpening> jobs = linkedInService.getCompanyJobPostings();
                if (jobs == null || jobs.isEmpty()) {
                    // Fallback to default jobs if LinkedIn API fails
                    jobs = List.of(
                        JobOpening.builder()
                            .id("founding-engineer-1")
                            .title("Founding Engineer")
                            .location("Miami, FL")
                            .url("https://www.linkedin.com/jobs/view/4138405825")
                            .build(),
                        JobOpening.builder()
                            .id("founding-engineer-2")
                            .title("Founding Engineer")
                            .location("Miami, FL")
                            .url("https://www.linkedin.com/jobs/view/4138405825")
                            .build()
                    );
                }
                cacheService.put(CACHE_PATH, JOBS_KEY, jobs);
                return jobs;
            });
    }
}
