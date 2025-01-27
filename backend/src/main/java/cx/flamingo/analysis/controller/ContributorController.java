package cx.flamingo.analysis.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.model.ApiResponse;
import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Contributor;
import cx.flamingo.analysis.model.Language;
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

    @GetMapping
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
            Map<String, City> targetCities = new HashMap<>();
            boolean isFirstSet = true;

            // Start with specific city if provided
            if (cityId != null) {
                log.info("Intersecting with city ID: {}", cityId);
                City city = cityService.getCityById(cityId);
                if (city != null) {
                    if (isFirstSet) {
                        targetCities.put(city.getId(), city);
                        isFirstSet = false;
                    } else {
                        targetCities.keySet().retainAll(List.of(city.getId()));
                    }
                }
            }

            // Intersect with team cities if provided
            if (teamId != null) {
                log.info("Intersecting with team ID: {}", teamId);
                List<City> teamCities = cityService.getCitiesByNearestTeamId(teamId);
                if (isFirstSet) {
                    teamCities.forEach(city -> targetCities.put(city.getId(), city));
                    isFirstSet = false;
                } else {
                    Set<String> teamCityIds = teamCities.stream()
                        .map(City::getId)
                        .collect(Collectors.toSet());
                    targetCities.keySet().retainAll(teamCityIds);
                }
            }

            // Intersect with region cities if provided
            if (regionId != null) {
                log.info("Intersecting with region ID: {}", regionId);
                List<City> regionCities = cityService.getCitiesByRegionId(regionId);
                if (isFirstSet) {
                    regionCities.forEach(city -> targetCities.put(city.getId(), city));
                    isFirstSet = false;
                } else {
                    Set<String> regionCityIds = regionCities.stream()
                        .map(City::getId)
                        .collect(Collectors.toSet());
                    targetCities.keySet().retainAll(regionCityIds);
                }
            }

            // Intersect with state cities if provided
            if (stateId != null) {
                log.info("Intersecting with state ID: {}", stateId);
                List<City> stateCities = cityService.getCitiesByStateId(stateId);
                if (isFirstSet) {
                    stateCities.forEach(city -> targetCities.put(city.getId(), city));
                    isFirstSet = false;
                } else {
                    Set<String> stateCityIds = stateCities.stream()
                        .map(City::getId)
                        .collect(Collectors.toSet());
                    targetCities.keySet().retainAll(stateCityIds);
                }
            }

            // If no parameters were provided, use all cities
            if (isFirstSet) {
                cityService.autocompleteCities(null, null, null, null)
                    .forEach(city -> targetCities.put(city.getId(), city));
            }

            Language selectedLanguage = languageId != null ? languageService.getLanguageById(languageId) : languageService.getDefaultLanguage();
            if (selectedLanguage == null) {
                log.warn("Language not found with ID: {}, using default language", languageId);
                selectedLanguage = languageService.getDefaultLanguage();
            }

            return githubService.getTopContributorsIn(new ArrayList<>(targetCities.values()), selectedLanguage, maxResults, priority);
        }).map(contributors -> {
            String message = String.format("Found %d contributors matching the criteria", contributors.size());
            return ApiResponse.success(contributors, message);
        }).orElseGet(() -> {
            log.warn("Cache miss and failed to fetch contributors. Returning empty list.");
            return ApiResponse.error("Failed to fetch contributors");
        });
    }
}
