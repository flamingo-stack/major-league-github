package cx.flamingo.analysis.model;

import java.util.Set;

import lombok.Value;

@Value
public class Region {
    String id;
    String name; // Internal name (e.g., "new-england")
    String displayName; // Human readable name (e.g., "New England")
    GeoCoordinates geo; // Geographic center of the region
    Set<String> stateIds;

    // Reference objects
    Set<State> states;
    Set<City> cities;

    @Value
    public static class GeoCoordinates {
        double latitude;
        double longitude;
    }
}
