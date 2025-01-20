package cx.flamingo.analysis.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.SoccerTeam;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SoccerTeamService {
    private List<SoccerTeam> teams;

    @PostConstruct
    public void init() {
        loadTeams();
        log.info("Loaded {} soccer teams", teams.size());
    }

    private void loadTeams() {
        teams = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("data/teams.csv").getInputStream()))) {
            
            // Skip header
            reader.readLine();
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                String id = parts[0];
                String name = parts[1];
                String city = parts[2];
                String state = parts[3];
                double latitude = Double.parseDouble(parts[4]);
                double longitude = Double.parseDouble(parts[5]);
                String league = parts[6];
                String stadium = parts[7];
                int stadiumCapacity = Integer.parseInt(parts[8]);
                int joinedYear = Integer.parseInt(parts[9]);
                String headCoach = parts[10];
                String teamUrl = parts[11];
                String wikipediaUrl = parts[12];
                String logoUrl = parts[13];
                
                SoccerTeam team = SoccerTeam.builder()
                    .id(id)
                    .name(name)
                    .city(city)
                    .state(state)
                    .latitude(latitude)
                    .longitude(longitude)
                    .league(league)
                    .stadium(stadium)
                    .stadiumCapacity(stadiumCapacity)
                    .joinedYear(joinedYear)
                    .headCoach(headCoach)
                    .teamUrl(teamUrl)
                    .wikipediaUrl(wikipediaUrl)
                    .logoUrl(logoUrl)
                    .build();
                
                teams.add(team);
            }
        } catch (IOException e) {
            log.error("Error loading teams from CSV", e);
            throw new RuntimeException("Failed to load teams", e);
        }
    }

    public String findNearestTeamId(City city) {
        if (teams.isEmpty()) {
            return null;
        }

        SoccerTeam nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (SoccerTeam team : teams) {
            double distance = calculateDistance(
                city.getLatitude(), city.getLongitude(),
                team.getLatitude(), team.getLongitude()
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = team;
            }
        }

        return nearest != null ? nearest.getId() : null;
    }

    public SoccerTeam getTeamById(String id) {
        return teams.stream()
            .filter(t -> t.getId().equals(id))
            .findFirst()
            .orElse(null);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    public List<SoccerTeam> getAllTeams() {
        return teams;
    }

    public List<SoccerTeam> autocompleteTeams(String query, int maxResults) {
        if (query == null || query.trim().isEmpty()) {
            return teams.stream()
                .sorted((a, b) -> Integer.compare(b.getStadiumCapacity(), a.getStadiumCapacity()))
                .limit(maxResults)
                .collect(Collectors.toList());
        }

        String normalizedQuery = query.toLowerCase().trim();
        return teams.stream()
            .filter(team -> 
                team.getName().toLowerCase().contains(normalizedQuery) ||
                team.getCity().toLowerCase().contains(normalizedQuery) ||
                team.getState().toLowerCase().contains(normalizedQuery))
            .sorted((a, b) -> Integer.compare(b.getStadiumCapacity(), a.getStadiumCapacity()))
            .limit(maxResults)
            .collect(Collectors.toList());
    }
} 