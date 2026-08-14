package cx.flamingo.analysis.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.model.JobOpening;
import cx.flamingo.analysis.model.ApiResponse;
import cx.flamingo.analysis.service.CacheService;
import cx.flamingo.analysis.service.HiringService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hiring")
@RequiredArgsConstructor
public class HiringController {
    
    private final HiringService hiringService;
    private final CacheService cacheService;

    @GetMapping("/manager")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHiringManagerProfile() {
        if (!cacheService.isCacheReady()) {
            return ResponseEntity.ok(ApiResponse.error("Cache is not ready yet, please try again later"));
        }
        Map<String, Object> profile = hiringService.getHiringManagerProfile();
        return ResponseEntity.ok(ApiResponse.success("Hiring manager profile retrieved successfully", profile));
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobOpening>>> getJobOpenings() {
        if (!cacheService.isCacheReady()) {
            return ResponseEntity.ok(ApiResponse.error("Cache is not ready yet, please try again later"));
        }
        List<JobOpening> jobs = hiringService.getJobOpenings();
        return ResponseEntity.ok(ApiResponse.success("Job openings retrieved successfully", jobs));
    }
} 
