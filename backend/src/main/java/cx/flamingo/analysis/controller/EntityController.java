package cx.flamingo.analysis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public City getCityById(@PathVariable String id) {
        return cityService.getCityById(id);
    }

    @GetMapping("/regions/{id}")
    public Region getRegionById(@PathVariable String id) {
        return regionService.getRegionById(id);
    }

    @GetMapping("/states/{id}")
    public State getStateById(@PathVariable String id) {
        return stateService.getStateById(id);
    }

    @GetMapping("/languages/{id}")
    public Language getLanguageById(@PathVariable String id) {
        return languageService.getLanguageById(id);
    }

    @GetMapping("/teams/{id}")
    public SoccerTeam getTeamById(@PathVariable String id) {
        return soccerTeamService.getTeamById(id);
    }
} 