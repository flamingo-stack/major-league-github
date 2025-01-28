package cx.flamingo.analysis.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobOpening {
    private String id;
    private String title;
    private String location;
    private String url;
} 