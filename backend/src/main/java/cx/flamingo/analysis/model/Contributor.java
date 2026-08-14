package cx.flamingo.analysis.model;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
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
    private Instant lastActive;                // Used by both roles now

    // Individual stats fields - used by CONTRIBUTOR
    private int totalCommits;
    private int javaRepos;
    private int starsReceived;
    private int forksReceived;
    private int starsGiven;
    private int forksGiven;
    private int score;

    public Map<String, Integer> getGithubStats() {
        if (type == Role.CONTRIBUTOR) {
            // For contributors, convert individual fields to map format and cache in field
            if (githubStats == null) {
                Map<String, Integer> stats = new HashMap<>();
                stats.put("score", score);
                stats.put("totalCommits", totalCommits);
                stats.put("javaRepos", javaRepos);
                stats.put("starsReceived", starsReceived);
                stats.put("forksReceived", forksReceived);
                stats.put("starsGiven", starsGiven);
                stats.put("forksGiven", forksGiven);
                githubStats = stats;
            }
            return githubStats;
        }
        return githubStats;
    }

    public Instant getLastActive() {
        return lastActive;
    }
}
