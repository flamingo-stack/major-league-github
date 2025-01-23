package cx.flamingo.analysis.service;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.google.gson.JsonObject;

import cx.flamingo.analysis.cache.CacheService;
import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Contributor;
import cx.flamingo.analysis.model.Language;
import cx.flamingo.analysis.rate.GithubTokenRateManager;

class GitHubServiceTest {

    @Mock
    private CacheService cacheService;
    
    @Mock
    private CityService cityService;

    @Mock
    private LanguageService languageService;

    @Mock
    private GithubTokenRateManager githubTokenRateManager;

    private GithubService githubService;
    private City testCity;
    private Language testLanguage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testCity = City.builder()
            .id("test-city")
            .name("Test City")
            .build();

        testLanguage = Language.builder()
            .id("java")
            .name("Java")
            .displayName("Java")
            .build();

        githubService = new GithubService(
            cacheService,
            cityService,
            languageService,
            githubTokenRateManager
        );
    }

    @Test
    void getTopContributorsIn_Success() {
        // Given
        List<City> cities = List.of(testCity);
        int maxResults = 10;

        // When
        List<Contributor> contributors = githubService.getTopContributorsIn(cities, testLanguage, maxResults);

        // Then
        assertNotNull(contributors);
        assertEquals(0, contributors.size());
        verify(cacheService, atLeastOnce()).getGitHubApiResponse(any(), eq(testLanguage.getName()), anyInt(), any());
    }

    @Test   
    void getContributorsForCity_Success() {
        // Given
        int maxResults = 10;

        // When
        List<Contributor> contributors = githubService.getContributorsForCity(testCity, testLanguage, maxResults);

        // Then
        assertNotNull(contributors);
        assertEquals(0, contributors.size());
        verify(cacheService, atLeastOnce()).getGitHubApiResponse(eq(testCity), eq(testLanguage.getName()), anyInt(), any());
    }

    @Test
    void getContributorsForCity_CacheHit() {
        // Given
        int maxResults = 10;
        JsonObject mockResponse = new JsonObject(); // Empty response
        when(cacheService.getGitHubApiResponse(eq(testCity), eq(testLanguage.getName()), anyInt(), any()))
            .thenReturn(Optional.of(mockResponse));

        // When
        List<Contributor> contributors = githubService.getContributorsForCity(testCity, testLanguage, maxResults);

        // Then
        assertNotNull(contributors);
        assertTrue(contributors.isEmpty());
        verify(cacheService, atLeastOnce()).getGitHubApiResponse(eq(testCity), eq(testLanguage.getName()), anyInt(), any());
    }

    @Test
    void getContributorsForCity_InvalidInput() {
        // Test null city
        assertThrows(IllegalArgumentException.class, () -> {
            githubService.getContributorsForCity(null, testLanguage, 10);
        }, "Should throw IllegalArgumentException for null city");
        
        // Test null language
        assertThrows(IllegalArgumentException.class, () -> {
            githubService.getContributorsForCity(testCity, null, 10);
        }, "Should throw IllegalArgumentException for null language");
        
        // Test negative maxResults
        assertThrows(IllegalArgumentException.class, () -> {
            githubService.getContributorsForCity(testCity, testLanguage, -1);
        }, "Should throw IllegalArgumentException for negative maxResults");
        
        // Test zero maxResults
        assertThrows(IllegalArgumentException.class, () -> {
            githubService.getContributorsForCity(testCity, testLanguage, 0);
        }, "Should throw IllegalArgumentException for zero maxResults");
    }
} 