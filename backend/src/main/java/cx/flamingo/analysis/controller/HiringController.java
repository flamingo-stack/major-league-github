package cx.flamingo.analysis.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.model.JobOpening;
import cx.flamingo.analysis.service.HiringService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hiring")
@RequiredArgsConstructor
public class HiringController {
    
    private final HiringService hiringService;

    @GetMapping("/manager")
    public Map<String, Object> getHiringManagerProfile() {
        return hiringService.getHiringManagerProfile();
    }

    @GetMapping("/jobs")
    public Map<String, Object> getJobOpenings() {
        Map<String, Object> response = new HashMap<>();
        List<JobOpening> jobs = hiringService.getJobOpenings();
        response.put("status", "success");
        response.put("message", "Job openings retrieved successfully");
        response.put("data", jobs);
        return response;
    }
} 