package cx.flamingo.analysis.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.dto.ApiResponse;
import cx.flamingo.analysis.model.JobOpening;
import cx.flamingo.analysis.service.HiringService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hiring")
@RequiredArgsConstructor
public class HiringController {
    
    private final HiringService hiringService;

    @GetMapping("/manager")
    public ApiResponse<Map<String, Object>> getHiringManagerProfile() {
        return ApiResponse.success(hiringService.getHiringManagerProfile());
    }

    @GetMapping("/jobs")
    public ApiResponse<List<JobOpening>> getJobOpenings() {
        List<JobOpening> jobs = hiringService.getJobOpenings();
        return ApiResponse.success("Job openings retrieved successfully", jobs);
    }
} 
