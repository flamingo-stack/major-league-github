package cx.flamingo.analysis.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.State;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StateService {
    private List<State> states;

    private final CityService cityService;

    @Autowired
    public StateService(@Lazy CityService cityService) {
        this.cityService = cityService;
    }

    @PostConstruct
    public void init() {
        loadStates();
        log.info("Loaded {} states", states.size());
    }

    private void loadStates() {
        states = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("data/states.csv").getInputStream()))) {
            
            // Skip header
            reader.readLine();
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                String id = parts[0];
                String name = parts[1];
                String code = parts[2];
                String iconUrl = parts[3];
                
                State state = State.builder()
                    .id(id)
                    .name(name)
                    .code(code)
                    .iconUrl(iconUrl)
                    .regionIds(new HashSet<>())
                    .build();
                
                states.add(state);
            }
        } catch (IOException e) {
            log.error("Error loading states from CSV", e);
            throw new RuntimeException("Failed to load states", e);
        }
    }

    private int getStateTotalPopulation(State state) {
        return cityService.getAllCities().stream()
            .filter(city -> city.getStateId().equals(state.getId()))
            .mapToInt(City::getPopulation)
            .sum();
    }

    public List<State> autocompleteStates(String query, String regionId, List<String> cityIds, int maxResults) {
        Stream<State> stateStream = states.stream();

        if (regionId != null) {
            stateStream = stateStream.filter(state -> state.getRegionIds().contains(regionId));
        }

        if (cityIds != null && !cityIds.isEmpty()) {
            Set<String> validStateIds = cityService.getAllCities().stream()
                .filter(city -> cityIds.contains(city.getId()))
                .map(City::getStateId)
                .collect(Collectors.toSet());
            stateStream = stateStream.filter(state -> validStateIds.contains(state.getId()));
        }

        if (query != null && !query.trim().isEmpty()) {
            String normalizedQuery = query.toLowerCase().trim();
            stateStream = stateStream.filter(state -> 
                state.getName().toLowerCase().contains(normalizedQuery) ||
                state.getCode().toLowerCase().contains(normalizedQuery));
        }

        return stateStream
            .sorted((a, b) -> Integer.compare(getStateTotalPopulation(b), getStateTotalPopulation(a))) // Sort by total population descending
            .limit(maxResults)
            .collect(Collectors.toList());
    }

    public State getStateById(String id) {
        return states.stream()
            .filter(s -> s.getId().equals(id))
            .findFirst()
            .orElse(null);
    }

    public State getStateByCode(String code) {
        return states.stream()
            .filter(s -> s.getCode().equalsIgnoreCase(code))
            .findFirst()
            .orElse(null);
    }

    public List<State> getAllStates() {
        return new ArrayList<>(states);
    }
} 