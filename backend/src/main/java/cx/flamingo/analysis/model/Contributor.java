package cx.flamingo.analysis.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Contributor {
    private String login;
    private String name;
    private String url;
    private String email;
    private String website;
    private String avatarUrl;
    private int totalCommits;
    private int javaRepos;
    private int starsReceived;
    private int forksReceived;
    private int totalStars;
    private int totalForks;
    private LocalDateTime latestCommitDate;
    private int starsGiven;
    private int forksGiven;
    private int score;
    private String cityId;
    private String nearestTeamId;
    
    // Reference objects
    private City city;
    private SoccerTeam nearestTeam;
}
