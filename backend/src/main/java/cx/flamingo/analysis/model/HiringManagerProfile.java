package cx.flamingo.analysis.model;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HiringManagerProfile {
    private String name;
    private String avatarUrl;
    private String role;
    private String bio;
    private List<SocialLink> socialLinks;

    @Data
    @Builder
    public static class SocialLink {
        private String platform;
        private String url;
    }
} 