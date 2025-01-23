package cx.flamingo.analysis.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Language;
import cx.flamingo.analysis.model.Region;
import cx.flamingo.analysis.model.SoccerTeam;
import cx.flamingo.analysis.model.State;
import cx.flamingo.analysis.service.CityService;
import cx.flamingo.analysis.service.LanguageService;
import cx.flamingo.analysis.service.RegionService;
import cx.flamingo.analysis.service.SoccerTeamService;
import cx.flamingo.analysis.service.StateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/autocomplete")
@RequiredArgsConstructor
public class AutocompleteController {

    private final CityService cityService;
    private final StateService stateService;
    private final RegionService regionService;
    private final LanguageService languageService;
    private final SoccerTeamService soccerTeamService;

    @GetMapping("/cities")
    public List<City> autocompleteCities(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String regionId,
            @RequestParam(required = false) String stateId,
            @RequestParam(defaultValue = "50") int maxResults) {
        log.info("Autocomplete cities with query: {}, regionId: {}, stateId: {}, maxResults: {}",
                query != null ? query : "none",
                regionId != null ? regionId : "none",
                stateId != null ? stateId : "none",
                maxResults);
        return cityService.autocompleteCities(query, regionId, stateId, maxResults);
    }

    @GetMapping("/regions")
    public List<Region> autocompleteRegions(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String stateId,
            @RequestParam(required = false) List<String> cityIds,
            @RequestParam(defaultValue = "50") int maxResults) {
        log.info("Autocomplete regions with query: {}, stateId: {}, cityIds: {}, maxResults: {}", 
                query != null ? query : "none",
                stateId != null ? stateId : "none",
                cityIds != null ? cityIds : "none",
                maxResults);
        return regionService.autocompleteRegions(query, stateId, cityIds, maxResults);
    }

    @GetMapping("/states")
    public List<State> autocompleteStates(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String regionId,
            @RequestParam(required = false) List<String> cityIds,
            @RequestParam(defaultValue = "50") int maxResults) {
        log.info("Autocomplete states with query: {}, regionId: {}, cityIds: {}, maxResults: {}", 
                query != null ? query : "none",
                regionId != null ? regionId : "none",
                cityIds != null ? cityIds : "none",
                maxResults);
        return stateService.autocompleteStates(query, regionId, cityIds, maxResults);
    }

    @GetMapping("/languages")
    public List<Language> autocompleteLanguages(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "50") int maxResults) {
        log.info("Autocomplete languages with query: {}, maxResults: {}", 
                query != null ? query : "none", 
                maxResults);
        return languageService.autocompleteLanguages(query, maxResults);
    }

    @GetMapping("/teams")
    public List<SoccerTeam> autocompleteTeams(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "50") int maxResults) {
        log.info("Autocomplete teams with query: {}, maxResults: {}", 
                query != null ? query : "none", 
                maxResults);
        return soccerTeamService.autocompleteTeams(query, maxResults);
    }
}
