package cx.flamingo.analysis.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoccerTeam {
    private String id;
    private String name;
    private String city;
    private String state;
    private double latitude;
    private double longitude;
    private String league;
    private String stadium;
    private int stadiumCapacity;
    private int joinedYear;
    private String headCoach;
    private String teamUrl;
    private String wikipediaUrl;
    private String logoUrl;
} 