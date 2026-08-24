package cx.flamingo.analysis.model;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Region {
    String id;
    String name; // Internal name (e.g., "new-england")
    String displayName; // Human readable name (e.g., "New England")
    GeoCoordinates geo; // Geographic center of the region
    Set<String> stateIds;

    // Reference objects
    Set<State> states;
    Set<City> cities;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeoCoordinates {
        double latitude;
        double longitude;
    }
}
