package cx.flamingo.analysis.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class City {
    private String id;
    private String name;
    private String stateId;
    private int population;
    private double latitude;
    private double longitude;
    private Set<String> regionIds;
    private String nearestTeamId;

    // Reference objects
    private State state;
    private Set<Region> regions;
    private SoccerTeam nearestTeam;
} 