package cx.flamingo.analysis.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Language {
    private String id;
    private String name;
    private String displayName;
    private String iconUrl;
} 