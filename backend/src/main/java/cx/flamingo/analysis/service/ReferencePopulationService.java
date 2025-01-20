package cx.flamingo.analysis.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Region;
import cx.flamingo.analysis.model.State;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ReferencePopulationService {
    
    @Autowired
    private CityService cityService;
    
    @Autowired
    private RegionService regionService;
    
    @Autowired
    private StateService stateService;
    
    @PostConstruct
    public void init() {
        populateReferences();
    }
    
    public void populateReferences() {
        log.info("Starting to populate entity references...");
        populateRegionReferences();
        log.info("Finished populating entity references");
    }
    
    private void populateRegionReferences() {
        for (Region region : regionService.getAllRegions()) {
            // Fill states
            Set<State> states = region.getStateIds().stream()
                .map(stateService::getStateByCode)
                .filter(state -> state != null)
                .peek(state -> state.getRegionIds().add(region.getId()))
                .collect(Collectors.toSet());
            
            // Fill cities
            Set<City> cities = cityService.getAllCities().stream()
                .filter(city -> city.getRegionIds().contains(region.getId()))
                .collect(Collectors.toSet());
            
            // Create a new Region instance with filled references
            Region filledRegion = new Region(
                region.getId(),
                region.getName(),
                region.getDisplayName(),
                region.getGeo(),
                region.getStateIds(),
                states,
                cities
            );
            
            // Replace the original region with the filled one
            regionService.updateRegion(filledRegion);
        }
    }
} 