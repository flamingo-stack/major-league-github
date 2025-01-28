package cx.flamingo.analysis.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.model.HiringManagerProfile;
import cx.flamingo.analysis.model.JobOpening;
import cx.flamingo.analysis.service.HiringService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hiring")
@RequiredArgsConstructor
public class HiringController {
    
    private final HiringService hiringService;

    @GetMapping("/manager")
    public HiringManagerProfile getHiringManagerProfile() {
        return hiringService.getHiringManagerProfile();
    }

    @GetMapping("/jobs")
    public List<JobOpening> getJobOpenings() {
        return hiringService.getJobOpenings();
    }
} 