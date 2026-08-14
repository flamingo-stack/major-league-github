package cx.flamingo.analysis.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Region;
import cx.flamingo.analysis.model.State;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReferencePopulationService {
    
    private final CityService cityService;
    
    private final RegionService regionService;
    
    private final StateService stateService;

    private volatile boolean initialized = false;

    @EventListener(ContextRefreshedEvent.class)
    public synchronized void init() {
        if (initialized) {
            return;
        }
        initialized = true;
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
                .collect(Collectors.toSet());

            // Mutate state objects in an explicit loop, not via peek()
            for (State state : states) {
                state.getRegionIds().add(region.getId());
            }
            
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
