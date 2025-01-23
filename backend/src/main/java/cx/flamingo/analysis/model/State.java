package cx.flamingo.analysis.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class State {
    private String id;
    private String name;
    private String code;
    private String displayName;
    private String iconUrl;
    private Set<String> regionIds;

    // Reference objects
    private Set<Region> regions;
    private Set<City> cities;
}
