package cx.flamingo.analysis.model;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HiringManagerProfile {
    private String name;
    private String avatarUrl;
    private String role;
    private String bio;
    private List<SocialLink> socialLinks;
    private Map<String, Integer> githubStats;

    @Data
    @Builder
    public static class SocialLink {
        private String platform;
        private String url;
    }
} 