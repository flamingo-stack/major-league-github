import { Box, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { City, Region, State, SoccerTeam, Language } from '../types/api';
import { useUrlState } from '../hooks/useUrlState';
import { LanguageAutocomplete } from './LanguageAutocomplete';
import { TeamAutocomplete } from './TeamAutocomplete';
import { RegionAutocomplete } from './RegionAutocomplete';
import { StateAutocomplete } from './StateAutocomplete';
import { CityAutocomplete } from './CityAutocomplete';
import { useEffect, useState } from 'react';
import { autocompleteLanguages } from '../services/api';

export const FiltersPanel = () => {
  const queryClient = useQueryClient();
  const { urlState, updateUrlState } = useUrlState();
  
  // Local state for selected entities
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>(undefined);
  const [selectedTeam, setSelectedTeam] = useState<SoccerTeam | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Input values for autocomplete
  const [languageInput, setLanguageInput] = useState('');
  const [teamInput, setTeamInput] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  // Load initial state from URL
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        // Load language or set default to Java
        if (urlState.languageId) {
          const language = await queryClient.fetchQuery({
            queryKey: ['language', urlState.languageId],
            queryFn: () => fetch(`/api/entities/languages/${urlState.languageId}`).then(res => res.json())
          });
          setSelectedLanguage(language);
          setLanguageInput(language.displayName);
        } else {
          // Set Java as default
          const languages = await queryClient.fetchQuery({
            queryKey: ['languages', 'Java'],
            queryFn: ({ signal }) => autocompleteLanguages('Java', signal)
          });
          const java = languages.find(lang => lang.name === 'Java');
          if (java) {
            setSelectedLanguage(java);
            setLanguageInput(java.displayName);
            updateUrlState({
              ...urlState,
              languageId: java.id
            });
          }
        }

        // Load team
        if (urlState.teamId) {
          const team = await queryClient.fetchQuery({
            queryKey: ['team', urlState.teamId],
            queryFn: () => fetch(`/api/entities/teams/${urlState.teamId}`).then(res => res.json())
          });
          setSelectedTeam(team);
          setTeamInput(team.name);
        }

        // Load region
        if (urlState.selectedRegionId) {
          const region = await queryClient.fetchQuery({
            queryKey: ['region', urlState.selectedRegionId],
            queryFn: () => fetch(`/api/entities/regions/${urlState.selectedRegionId}`).then(res => res.json())
          });
          setSelectedRegion(region);
          setRegionInput(region.displayName);
        }

        // Load state
        if (urlState.stateId) {
          const state = await queryClient.fetchQuery({
            queryKey: ['state', urlState.stateId],
            queryFn: () => fetch(`/api/entities/states/${urlState.stateId}`).then(res => res.json())
          });
          setSelectedState(state);
          setStateInput(state.name);
        }

        // Load city
        if (urlState.selectedCityId) {
          const city = await queryClient.fetchQuery({
            queryKey: ['city', urlState.selectedCityId],
            queryFn: () => fetch(`/api/entities/cities/${urlState.selectedCityId}`).then(res => res.json())
          });
          setSelectedCity(city);
          setCityInput(city.name);
        }
      } catch (error) {
        console.error('Error loading initial state:', error);
        // Clear invalid IDs from URL state
        updateUrlState({
          languageId: null,
          teamId: null,
          selectedRegionId: null,
          stateId: null,
          selectedCityId: null
        });
      }
    };

    loadInitialState();
  }, [urlState.languageId, urlState.teamId, urlState.selectedRegionId, urlState.stateId, urlState.selectedCityId]);

  // Handle selection changes
  const handleLanguageChange = (language: Language | null) => {
    // Don't allow deselecting language
    if (!language) {
      // Set back to Java
      queryClient.fetchQuery({
        queryKey: ['languages', 'Java'],
        queryFn: ({ signal }) => autocompleteLanguages('Java', signal)
      }).then(languages => {
        const java = languages.find(lang => lang.name === 'Java');
        if (java) {
          setSelectedLanguage(java);
          setLanguageInput(java.displayName);
          updateUrlState({
            ...urlState,
            languageId: java.id
          });
        }
      });
      return;
    }

    setSelectedLanguage(language || undefined);
    setLanguageInput(language?.displayName || '');
    updateUrlState({
      ...urlState,
      languageId: language?.id || null
    });
  };

  const handleTeamChange = (team: SoccerTeam | null) => {
    setSelectedTeam(team);
    setTeamInput(team?.name || '');
    updateUrlState({
      ...urlState,
      teamId: team?.id || null
    });
  };

  const handleRegionChange = (region: Region | null) => {
    setSelectedRegion(region);
    setRegionInput(region?.displayName || '');
    setSelectedCity(null);
    setCityInput('');

    if (region) {
      if (selectedState && !region.stateIds.includes(selectedState.id)) {
        setSelectedState(null);
        setStateInput('');
        updateUrlState({
          ...urlState,
          selectedRegionId: region.id,
          selectedCityId: null,
          stateId: null
        });
      } else {
        updateUrlState({
          ...urlState,
          selectedRegionId: region.id,
          selectedCityId: null,
          stateId: selectedState?.id || null
        });
      }
    } else {
      updateUrlState({
        ...urlState,
        selectedRegionId: null,
        selectedCityId: null
      });
    }
  };

  const handleStateChange = (state: State | null) => {
    setSelectedState(state);
    setStateInput(state?.name || '');
    setSelectedCity(null);
    setCityInput('');

    if (state) {
      updateUrlState({
        ...urlState,
        stateId: state.id,
        selectedCityId: null
      });
    } else {
      updateUrlState({
        ...urlState,
        stateId: null,
        selectedCityId: null
      });
    }
  };

  const handleCityChange = (city: City | null) => {
    setSelectedCity(city);
    setCityInput(city?.name || '');
    
    updateUrlState({
      ...urlState,
      selectedCityId: city?.id || null
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Programming Language
          </Typography>
          <LanguageAutocomplete
            value={selectedLanguage}
            onChange={handleLanguageChange}
            inputValue={languageInput}
            onInputChange={setLanguageInput}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Soccer Team
          </Typography>
          <TeamAutocomplete
            value={selectedTeam}
            onChange={handleTeamChange}
            inputValue={teamInput}
            onInputChange={setTeamInput}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Region
          </Typography>
          <RegionAutocomplete
            value={selectedRegion}
            onChange={handleRegionChange}
            inputValue={regionInput}
            onInputChange={setRegionInput}
            stateId={selectedState?.id}
            cityIds={selectedCity ? [selectedCity.id] : undefined}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            State
          </Typography>
          <StateAutocomplete
            value={selectedState}
            onChange={handleStateChange}
            inputValue={stateInput}
            onInputChange={setStateInput}
            regionId={selectedRegion?.id}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            City
          </Typography>
          <CityAutocomplete
            value={selectedCity}
            onChange={handleCityChange}
            inputValue={cityInput}
            onInputChange={setCityInput}
            regionId={selectedRegion?.id}
            stateId={selectedState?.id}
          />
        </Box>
      </Box>
    </Box>
  );
}; 