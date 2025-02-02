package cx.flamingo.analysis.model;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class Contributor {
    public enum Role {
        CONTRIBUTOR,
        HIRING_MANAGER
    }

    // Common fields for both roles
    private String login;
    private String name;
    private String avatarUrl;
    private String url;
    private String email;
    private String role;  // Job role/title
    private String bio;
    private Role type;    // Whether this is a contributor or hiring manager
    private List<SocialLink> socialLinks;
    private String cityId;
    private String nearestTeamId;
    private City city;
    private SoccerTeam nearestTeam;

    // Stats fields - used by both roles but stored differently
    private Map<String, Integer> githubStats;  // Used by HIRING_MANAGER
    private Instant lastActive;                // Used by HIRING_MANAGER

    // Individual stats fields - used by CONTRIBUTOR
    private int totalCommits;
    private int javaRepos;
    private int starsReceived;
    private int forksReceived;
    private int starsGiven;
    private int forksGiven;
    private int score;
    private LocalDateTime latestCommitDate;

    public Map<String, Integer> getGithubStats() {
        if (type == Role.CONTRIBUTOR) {
            // For contributors, convert individual fields to map format
            Map<String, Integer> stats = new HashMap<>();
            stats.put("score", score);
            stats.put("totalCommits", totalCommits);
            stats.put("javaRepos", javaRepos);
            stats.put("starsReceived", starsReceived);
            stats.put("forksReceived", forksReceived);
            stats.put("starsGiven", starsGiven);
            stats.put("forksGiven", forksGiven);
            return stats;
        }
        return githubStats;
    }

    public Instant getLastActive() {
        if (type == Role.CONTRIBUTOR && latestCommitDate != null) {
            return latestCommitDate.toInstant(java.time.ZoneOffset.UTC);
        }
        return lastActive;
    }
}
