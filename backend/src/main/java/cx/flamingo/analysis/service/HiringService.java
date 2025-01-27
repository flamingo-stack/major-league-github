package cx.flamingo.analysis.service;

import java.util.Arrays;
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
    private final CacheServiceAbs cacheService;
    
    @Value("${github.username}")
    private String githubUsername;

    @Value("${github.cache.refresh.interval}")
    private Long refreshInterval;

    private static final String CACHE_PATH = "hiring";
    private static final String PROFILE_KEY = "manager_profile";
    private static final String JOBS_KEY = "job_openings";

    public HiringManagerProfile getHiringManagerProfile() {
        return cacheService.get(CACHE_PATH, PROFILE_KEY, new TypeToken<HiringManagerProfile>() {}, refreshInterval)
            .orElseGet(() -> {
                HiringManagerProfile profile = githubService.fetchUserProfile(githubUsername);
                cacheService.put(CACHE_PATH, PROFILE_KEY, profile);
                return profile;
            });
    }

    public List<JobOpening> getJobOpenings() {
        return cacheService.get(CACHE_PATH, JOBS_KEY, new TypeToken<List<JobOpening>>() {}, refreshInterval)
            .orElseGet(() -> {
                List<JobOpening> jobs = fetchJobOpenings();
                cacheService.put(CACHE_PATH, JOBS_KEY, jobs);
                return jobs;
            });
    }

    private List<JobOpening> fetchJobOpenings() {
        // TODO: Integrate with actual job posting system or database
        return Arrays.asList(
            JobOpening.builder()
                .id("1")
                .title("Senior Full Stack Engineer")
                .location("Remote")
                .url("https://www.linkedin.com/jobs/view/xxx")
                .build(),
            JobOpening.builder()
                .id("2")
                .title("Senior Frontend Engineer")
                .location("Remote")
                .url("https://www.linkedin.com/jobs/view/yyy")
                .build()
        );
    }
} 