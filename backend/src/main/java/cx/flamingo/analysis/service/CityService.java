package cx.flamingo.analysis.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.City;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CityService {
    private List<City> cities;

    private final SoccerTeamService soccerTeamService;
    private final StateService stateService;

    @Autowired
    public CityService(SoccerTeamService soccerTeamService, @Lazy StateService stateService) {
        this.soccerTeamService = soccerTeamService;
        this.stateService = stateService;
    }

    @PostConstruct
    public void init() {
        loadCities();
        log.info("Loaded {} cities", cities.size());
    }

    private void loadCities() {
        cities = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("data/cities.csv").getInputStream()));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord record : csvParser) {
                String id = record.get(0);
                String name = record.get(1);
                String stateId = record.get(2);
                int population = Integer.parseInt(record.get(3));
                double latitude = Double.parseDouble(record.get(4));
                double longitude = Double.parseDouble(record.get(5));
                Set<String> regionIds = Arrays.stream(record.get(6).split("\\|"))
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
            city.setState(stateService.getStateById(city.getStateId()));
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

    public Optional<City> getCityById(String id) {
        return cities.stream()
            .filter(c -> c.getId().equals(id))
            .findFirst()
            .map(this::populateState);
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
