package cx.flamingo.analysis.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Region;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RegionService {
    private List<Region> regions;

    @Autowired
    private StateService stateService;

    @Autowired
    private CityService cityService;

    @PostConstruct
    public void init() {
        loadRegions();
        log.info("Loaded {} regions", regions.size());
    }

    private void loadRegions() {
        regions = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("data/regions.csv").getInputStream()))) {
            
            // Skip header
            reader.readLine();
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                String id = parts[0];
                String name = parts[1];
                String displayName = parts[2];
                double latitude = Double.parseDouble(parts[3]);
                double longitude = Double.parseDouble(parts[4]);
                Set<String> stateIds = Arrays.stream(parts[5].split("\\|"))
                    .collect(Collectors.toSet());
                
                Region region = new Region(
                    id, name, displayName,
                    new Region.GeoCoordinates(latitude, longitude),
                    stateIds,
                    Set.of(),
                    Set.of()
                );
                
                regions.add(region);
            }
        } catch (IOException e) {
            log.error("Error loading regions from CSV", e);
            throw new RuntimeException("Failed to load regions", e);
        }
    }

    public void updateRegion(Region updatedRegion) {
        int index = -1;
        for (int i = 0; i < regions.size(); i++) {
            if (regions.get(i).getId().equals(updatedRegion.getId())) {
                index = i;
                break;
            }
        }
        
        if (index != -1) {
            regions.set(index, updatedRegion);
        } else {
            log.warn("Attempted to update non-existent region with ID: {}", updatedRegion.getId());
        }
    }

    private int getRegionTotalPopulation(Region region) {
        return cityService.getAllCities().stream()
            .filter(city -> city.getRegionIds().contains(region.getId()))
            .mapToInt(City::getPopulation)
            .sum();
    }

    public List<Region> autocompleteRegions(String query, String stateId, List<String> cityIds, int maxResults) {
        Stream<Region> regionStream = regions.stream();

        if (stateId != null) {
            regionStream = regionStream.filter(region -> region.getStateIds().contains(stateId));
        }

        if (cityIds != null && !cityIds.isEmpty()) {
            Set<String> validRegionIds = cityService.getAllCities().stream()
                .filter(city -> cityIds.contains(city.getId()))
                .flatMap(city -> city.getRegionIds().stream())
                .collect(Collectors.toSet());
            regionStream = regionStream.filter(region -> validRegionIds.contains(region.getId()));
        }

        if (query != null && !query.trim().isEmpty()) {
            String normalizedQuery = query.toLowerCase().trim();
            regionStream = regionStream.filter(region -> 
                region.getName().toLowerCase().contains(normalizedQuery) ||
                region.getDisplayName().toLowerCase().contains(normalizedQuery));
        }

        return regionStream
            .sorted((a, b) -> Integer.compare(getRegionTotalPopulation(b), getRegionTotalPopulation(a))) // Sort by total population descending
            .limit(maxResults)
            .collect(Collectors.toList());
    }

    public Region getRegionById(String id) {
        return regions.stream()
            .filter(r -> r.getId().equals(id))
            .findFirst()
            .orElse(null);
    }

    public Region getRegionByName(String name) {
        return regions.stream()
            .filter(r -> r.getName().equalsIgnoreCase(name))
            .findFirst()
            .orElse(null);
    }

    public List<Region> getAllRegions() {
        return new ArrayList<>(regions);
    }
} 