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

import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.City;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CityService {
    private List<City> cities;

    private final SoccerTeamService soccerTeamService;
    @Lazy
    private final StateService stateService;

    @PostConstruct
    public void init() {
        loadCities();
        log.info("Loaded {} cities", cities.size());
    }

    private void loadCities() {
        cities = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("data/cities.csv").getInputStream()))) {
            
            // Skip header
            reader.readLine();
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = splitCsvLine(line);
                String id = parts[0];
                String name = parts[1];
                String stateId = parts[2];
                int population = Integer.parseInt(parts[3].trim());
                double latitude = Double.parseDouble(parts[4].trim());
                double longitude = Double.parseDouble(parts[5].trim());
                Set<String> regionIds = Arrays.stream(parts[6].split("\\|"))
                    .collect(Collectors.toSet());
                
                City city = City.builder()
                    .id(id)
                    .name(name)
                    .stateId(stateId)
                    .population(population)
                    .latitude(latitude)
                    .longitude(longitude)
                    .regionIds(regionIds)
                    .build();
                
                // Set nearest team ID
                city.setNearestTeamId(soccerTeamService.findNearestTeamId(city));
                
                cities.add(city);
            }
        } catch (IOException e) {
            log.error("Error loading cities from CSV", e);
            throw new RuntimeException("Failed to load cities", e);
        }
    }

    /**
     * Splits a CSV line respecting RFC 4180 quoted fields.
     * Quoted fields may contain commas; quotes are escaped by doubling them.
     */
    private String[] splitCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (inQuotes) {
                if (c == '"') {
                    // Peek ahead: doubled quote is an escaped quote
                    if (i + 1 < line.length() && line.charAt(i + 1) == '"') {
                        sb.append('"');
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    sb.append(c);
                }
            } else {
                if (c == '"') {
                    inQuotes = true;
                } else if (c == ',') {
                    fields.add(sb.toString());
                    sb.setLength(0);
                } else {
                    sb.append(c);
                }
            }
        }
        fields.add(sb.toString());
        return fields.toArray(new String[0]);
    }

    public List<City> autocompleteCities(String query, String regionId, String stateId, Integer maxResults) {
        Stream<City> cityStream = cities.stream().map(this::populateState);

        if (regionId != null) {
            cityStream = cityStream.filter(city -> city.getRegionIds().contains(regionId));
        }

        if (stateId != null) {
            cityStream = cityStream.filter(city -> city.getStateId().equals(stateId));
        }

        if (query != null && !query.trim().isEmpty()) {
            String normalizedQuery = query.toLowerCase().trim();
            cityStream = cityStream.filter(city -> 
                city.getName().toLowerCase().contains(normalizedQuery));
        }

        return cityStream
            .sorted((a, b) -> Integer.compare(b.getPopulation(), a.getPopulation())) // Sort by population descending
            .limit(maxResults == null ? Integer.MAX_VALUE : maxResults)
            .collect(Collectors.toList());
    }

    private City populateState(City city) {
        if (city.getState() == null) {
            synchronized (city) {
                if (city.getState() == null) {
                    city.setState(stateService.getStateById(city.getStateId()));
                }
            }
        }
        return city;
    }

    public List<City> getCitiesByStateId(String stateId) {
        return cities.stream()
            .filter(city -> city.getStateId().equals(stateId))
            .map(this::populateState)
            .collect(Collectors.toList());
    }

    public List<City> getCitiesByRegionId(String regionId) {
        if (regionId == null || regionId.equalsIgnoreCase("none")) {
            return new ArrayList<>(cities);
        }
        
        return cities.stream()
            .filter(city -> city.getRegionIds().contains(regionId))
            .map(this::populateState)
            .collect(Collectors.toList());
    }

    public City getCityById(String id) {
        City city = cities.stream()
            .filter(c -> c.getId().equals(id))
            .findFirst()
            .orElse(null);
            
        return city != null ? populateState(city) : null;
    }

    public List<City> getAllCities() {
        return cities.stream()
            .map(this::populateState)
            .collect(Collectors.toList());
    }

    public List<City> getCitiesByIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }
        
        return cities.stream()
            .filter(city -> ids.contains(city.getId()))
            .map(this::populateState)
            .collect(Collectors.toList());
    }

    public List<City> getCitiesByNearestTeamId(String teamId) {
        if (teamId == null) {
            return new ArrayList<>();
        }
        return cities.stream()
            .filter(city -> teamId.equals(city.getNearestTeamId()))
            .map(this::populateState)
            .sorted((a, b) -> Integer.compare(b.getPopulation(), a.getPopulation()))
            .collect(Collectors.toList());
    }
} 
