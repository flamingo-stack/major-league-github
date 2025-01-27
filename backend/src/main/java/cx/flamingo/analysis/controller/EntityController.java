package cx.flamingo.analysis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cx.flamingo.analysis.model.ApiResponse;
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
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/entities")
public class EntityController {

    @Autowired
    private CityService cityService;

    @Autowired
    private RegionService regionService;

    @Autowired
    private StateService stateService;

    @Autowired
    private LanguageService languageService;

    @Autowired
    private SoccerTeamService soccerTeamService;

    @GetMapping("/cities/{id}")
    public ApiResponse<City> getCityById(@PathVariable String id) {
        City city = cityService.getCityById(id);
        if (city == null) {
            log.warn("City not found with ID: {}", id);
            return ApiResponse.error(String.format("City not found with ID: %s", id));
        }
        return ApiResponse.success(city, String.format("Found city: %s", city.getName()));
    }

    @GetMapping("/regions/{id}")
    public ApiResponse<Region> getRegionById(@PathVariable String id) {
        Region region = regionService.getRegionById(id);
        if (region == null) {
            log.warn("Region not found with ID: {}", id);
            return ApiResponse.error(String.format("Region not found with ID: %s", id));
        }
        return ApiResponse.success(region, String.format("Found region: %s", region.getName()));
    }

    @GetMapping("/states/{id}")
    public ApiResponse<State> getStateById(@PathVariable String id) {
        State state = stateService.getStateById(id);
        if (state == null) {
            log.warn("State not found with ID: {}", id);
            return ApiResponse.error(String.format("State not found with ID: %s", id));
        }
        return ApiResponse.success(state, String.format("Found state: %s", state.getName()));
    }

    @GetMapping("/languages/{id}")
    public ApiResponse<Language> getLanguageById(@PathVariable String id) {
        Language language = languageService.getLanguageById(id);
        if (language == null) {
            log.warn("Language not found with ID: {}", id);
            return ApiResponse.error(String.format("Language not found with ID: %s", id));
        }
        return ApiResponse.success(language, String.format("Found language: %s", language.getName()));
    }

    @GetMapping("/teams/{id}")
    public ApiResponse<SoccerTeam> getTeamById(@PathVariable String id) {
        SoccerTeam team = soccerTeamService.getTeamById(id);
        if (team == null) {
            log.warn("Team not found with ID: {}", id);
            return ApiResponse.error(String.format("Team not found with ID: %s", id));
        }
        return ApiResponse.success(team, String.format("Found team: %s", team.getName()));
    }
} 