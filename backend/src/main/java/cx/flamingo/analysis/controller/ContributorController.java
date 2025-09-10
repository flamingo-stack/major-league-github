package cx.flamingo.analysis.controller;

import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.model.ApiResponse;
import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Contributor;
import cx.flamingo.analysis.model.Language;
import cx.flamingo.analysis.model.SocialLink;
import cx.flamingo.analysis.service.CityService;
import cx.flamingo.analysis.service.GithubService;
import cx.flamingo.analysis.service.LanguageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/contributors")
@RequiredArgsConstructor
public class ContributorController {

    private final GithubService githubService;
    private final CityService cityService;
    private final CacheServiceAbs cacheService;
    private final LanguageService languageService;

    private static final String MLG_BASE_URL = "https://www.mlg.soccer";

    @GetMapping("/search")
    public ApiResponse<List<Contributor>> getContributors(
            @RequestParam(required = false) String cityId,
            @RequestParam(required = false) String regionId,
            @RequestParam(required = false) String stateId,
            @RequestParam(required = false) String teamId,
            @RequestParam(required = false) String languageId,
            @RequestParam(defaultValue = "15") int maxResults,
            @RequestParam(required = false, defaultValue = "High") GithubService.GithubApiPriority priority) {

        if (!cacheService.isCacheReady()) {
            log.warn("Cache is still being populated, returning empty list");
            return ApiResponse.error("Cache is still being populated");
        }

        return cacheService.getHttpResponse(cityId, regionId, stateId, teamId, languageId, maxResults, () -> {
            List<City> targetCities = githubService.getTargetCities(cityId, regionId, stateId, teamId);

            Language selectedLanguage = languageId != null ? languageService.getLanguageById(languageId) : languageService.getDefaultLanguage();
            if (selectedLanguage == null) {
                log.warn("Language not found with ID: {}, using default language", languageId);
                selectedLanguage = languageService.getDefaultLanguage();
            }

            return githubService.getTopContributorsIn(targetCities, selectedLanguage, maxResults, priority);
        }).map(contributors -> {
            String message = String.format("Found %d contributors matching the criteria", contributors.size());
            return ApiResponse.success(contributors, message);
        }).orElseGet(() -> {
            log.warn("Cache miss and failed to fetch contributors. Returning empty list.");
            return ApiResponse.error("Failed to fetch contributors");
        });
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportContributors(
            @RequestParam(required = false) String cityId,
            @RequestParam(required = false) String regionId,
            @RequestParam(required = false) String stateId,
            @RequestParam(required = false) String teamId,
            @RequestParam(required = false) String languageId,
            @RequestParam(defaultValue = "15") int maxResults,
            @RequestParam(required = false, defaultValue = "High") GithubService.GithubApiPriority priority) {
        
        if (!cacheService.isCacheReady()) {
            return ResponseEntity.badRequest().body("Cache is still being populated");
        }

        var contributorsResponse = cacheService.getHttpResponse(cityId, regionId, stateId, teamId, languageId, maxResults, () -> {
            List<City> targetCities = githubService.getTargetCities(cityId, regionId, stateId, teamId);

            Language selectedLanguage = languageId != null ? languageService.getLanguageById(languageId) : languageService.getDefaultLanguage();
            if (selectedLanguage == null) {
                log.warn("Language not found with ID: {}, using default language", languageId);
                selectedLanguage = languageService.getDefaultLanguage();
            }

            return githubService.getTopContributorsIn(targetCities, selectedLanguage, maxResults, priority);
        });

        if (!contributorsResponse.isPresent()) {
            return ResponseEntity.internalServerError().body("Failed to fetch contributors");
        }

        List<Contributor> contributors = contributorsResponse.get();

        StringWriter stringWriter = new StringWriter();
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
            .setHeader("Rank", "First Name", "Last Name", "City", "State", "MLG URL", "GitHub URL", "Email", "Twitter", "LinkedIn")
            .build();

        try (CSVPrinter csvPrinter = new CSVPrinter(stringWriter, csvFormat)) {
            int rank = 1;
            for (Contributor contributor : contributors) {
                String[] nameParts = (contributor.getName() != null ? contributor.getName() : "Unknown Unknown").split(" ", 2);
                String firstName = nameParts[0];
                String lastName = nameParts.length > 1 ? nameParts[1] : "";
                
                String cityName = contributor.getCity() != null ? contributor.getCity().getName() : "";
                String stateName = contributor.getCity() != null && contributor.getCity().getState() != null ? 
                    contributor.getCity().getState().getName() : "";
                String mlgUrl = "";
                if (contributor.getCity() != null) {
                    mlgUrl = String.format("%s/?languageId=%s&cityId=%s", 
                        MLG_BASE_URL, 
                        languageId != null ? languageId : languageService.getDefaultLanguage().getId(),
                        contributor.getCity().getId()
                    );
                }
                
                // Initialize social URLs
                String githubUrl = "";
                String emailUrl = "";
                String twitterUrl = "";
                String linkedinUrl = "";
                
                // Extract social URLs
                if (contributor.getSocialLinks() != null) {
                    for (SocialLink link : contributor.getSocialLinks()) {
                        switch (link.getPlatform().toLowerCase()) {
                            case "github":
                                githubUrl = link.getUrl();
                                break;
                            case "email":
                                emailUrl = link.getUrl().replace("mailto:", "");
                                break;
                            case "twitter":
                                twitterUrl = link.getUrl();
                                break;
                            case "linkedin":
                                linkedinUrl = link.getUrl();
                                break;
                        }
                    }
                }

                csvPrinter.printRecord(
                    rank++,
                    firstName,
                    lastName,
                    cityName,
                    stateName,
                    mlgUrl,
                    githubUrl,
                    emailUrl,
                    twitterUrl,
                    linkedinUrl
                );
            }
        } catch (IOException e) {
            log.error("Error creating CSV file", e);
            return ResponseEntity.internalServerError().body("Error creating CSV file");
        }

        // Get the current date and time
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String dateStr = now.format(formatter);
        
        // Get language name
        Language language = languageId != null ? 
            languageService.getLanguageById(languageId) : 
            languageService.getDefaultLanguage();
        String languageName = language.getName().toLowerCase();
        
        // Build location part of filename
        String locationPart = "all";
        if (cityId != null) {
            City city = cityService.getCityById(cityId);
            locationPart = city != null ? city.getId() : "all";
        } else if (stateId != null) {
            locationPart = stateId;
        } else if (regionId != null) {
            locationPart = regionId;
        }

        // Construct filename
        String filename = String.format("mlg-contributors-%s-%s-%s.csv", 
            languageName,
            locationPart,
            dateStr
        );

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=%s", filename))
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(stringWriter.toString());
    }
}
