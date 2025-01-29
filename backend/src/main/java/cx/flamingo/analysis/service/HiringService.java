package cx.flamingo.analysis.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.reflect.TypeToken;

import cx.flamingo.analysis.cache.CacheServiceAbs;
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

    public HiringManagerProfile getHiringManagerProfile() {
        return cacheService.get(CACHE_PATH, PROFILE_KEY, new TypeToken<HiringManagerProfile>() {
        }, refreshInterval)
                .orElseGet(() -> {
                    HiringManagerProfile profile = githubService.fetchUserProfile(githubUsername);
                    cacheService.put(CACHE_PATH, PROFILE_KEY, profile);
                    return profile;
                });
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
