import { Box, Typography, useTheme, useMediaQuery, IconButton, Collapse } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { City, Region, State, SoccerTeam, Language } from '../types/api';
import { useUrlState } from '../hooks/useUrlState';
import { LanguageAutocomplete } from './LanguageAutocomplete';
import { TeamAutocomplete } from './TeamAutocomplete';
import { RegionAutocomplete } from './RegionAutocomplete';
import { StateAutocomplete } from './StateAutocomplete';
import { CityAutocomplete } from './CityAutocomplete';
import { useEffect, useState } from 'react';
import { getLanguageById, getTeamById, getRegionById, getStateById, getCityById, autocompleteLanguages } from '../services/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Utility function to dismiss keyboard
const dismissKeyboard = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

export const FiltersPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();
  const { urlState, updateUrlState } = useUrlState();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Local state for selected entities
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
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
          const language = await getLanguageById(urlState.languageId);
          setSelectedLanguage(language);
          setLanguageInput(language.displayName);
        } else {
          // Set Java as default
          const languages = await autocompleteLanguages('Java');
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
          const team = await getTeamById(urlState.teamId);
          setSelectedTeam(team);
          setTeamInput(team.name);
        }

        // Load region
        if (urlState.selectedRegionId) {
          const region = await getRegionById(urlState.selectedRegionId);
          setSelectedRegion(region);
          setRegionInput(region.displayName);
        }

        // Load state
        if (urlState.stateId) {
          const state = await getStateById(urlState.stateId);
          setSelectedState(state);
          setStateInput(state.name);
        }

        // Load city
        if (urlState.selectedCityId) {
          const city = await getCityById(urlState.selectedCityId);
          setSelectedCity(city);
          setCityInput(city.name);
        }
      } catch (error) {
        console.error('Error loading initial state:', error);
        // Only clear the problematic ID from URL state
        const newState = { ...urlState };
        if (error instanceof Error && error.message.includes('language')) {
          newState.languageId = null;
        }
        if (error instanceof Error && error.message.includes('team')) {
          newState.teamId = null;
        }
        if (error instanceof Error && error.message.includes('region')) {
          newState.selectedRegionId = null;
        }
        if (error instanceof Error && error.message.includes('state')) {
          newState.stateId = null;
        }
        if (error instanceof Error && error.message.includes('city')) {
          newState.selectedCityId = null;
        }
        updateUrlState(newState);
      }
    };

    loadInitialState();
  }, []);

  // Handle selection changes
  const handleLanguageChange = (language: Language | null) => {
    // Only set back to Java when explicitly clearing via the clear button
    if (!language && selectedLanguage) {
      // Set back to Java only if the input is empty
      if (!languageInput.trim()) {
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
            if (isMobile) dismissKeyboard();
          }
        }).catch(() => {
          // Ignore query cancellation errors
        });
      }
      return;
    }

    setSelectedLanguage(language);
    updateUrlState({
      ...urlState,
      languageId: language?.id || null
    });
    if (isMobile) dismissKeyboard();
  };

  // Handle input changes
  const handleLanguageInputChange = (value: string) => {
    setLanguageInput(value);
  };

  const handleTeamChange = (team: SoccerTeam | null) => {
    setSelectedTeam(team);
    setTeamInput(team?.name || '');
    updateUrlState({
      ...urlState,
      teamId: team?.id || null
    });
    if (isMobile) dismissKeyboard();
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
    if (isMobile) dismissKeyboard();
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
    if (isMobile) dismissKeyboard();
  };

  const handleCityChange = (city: City | null) => {
    setSelectedCity(city);
    setCityInput(city?.name || '');
    
    updateUrlState({
      ...urlState,
      selectedCityId: city?.id || null
    });
    if (isMobile) dismissKeyboard();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: { xs: 0.5, sm: 2 },
      px: 2,
      pt: { xs: 1, sm: 2 },
      pb: 1,
      width: '100%'
    }}>
      {/* First Row - Language and Team (Desktop) / Language (Mobile) */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 0.5, sm: 2 },
        width: '100%'
      }}>
        <Box sx={{ 
          flex: { xs: '1 1 100%', sm: 1 },
          width: '100%'
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Programming Language
          </Typography>
          <LanguageAutocomplete
            value={selectedLanguage}
            onChange={handleLanguageChange}
            inputValue={languageInput}
            onInputChange={handleLanguageInputChange}
          />
        </Box>
        <Box sx={{ 
          flex: { xs: '1 1 100%', sm: 1 },
          width: '100%',
          display: { xs: 'none', sm: 'block' }
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' }
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

      {/* Second Row - Region, State, City (Desktop) */}
      <Box sx={{ 
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'row',
        gap: 2,
        width: '100%'
      }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' }
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
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' }
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
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            City
          </Typography>
          <CityAutocomplete
            value={selectedCity}
            onChange={handleCityChange}
            inputValue={cityInput}
            onInputChange={setCityInput}
            stateId={selectedState?.id}
            regionId={selectedRegion?.id}
          />
        </Box>
      </Box>

      {/* Mobile City Field (Always Visible) */}
      <Box sx={{ 
        display: { xs: 'block', sm: 'none' },
        width: '100%',
        mb: 0
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1,
            fontWeight: 600,
            color: 'text.primary',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          City
        </Typography>
        <CityAutocomplete
          value={selectedCity}
          onChange={handleCityChange}
          inputValue={cityInput}
          onInputChange={setCityInput}
          stateId={selectedState?.id}
          regionId={selectedRegion?.id}
        />
      </Box>

      {/* Mobile Expand Button */}
      {isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: -0.5,
          mb: isExpanded ? 0 : 0,
          opacity: 0.8
        }}>
          <IconButton 
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ 
              color: 'text.secondary',
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s',
              p: 0.25,
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            {isExpanded ? (
              <ExpandLessIcon sx={{ fontSize: '1.25rem' }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: '1.25rem' }} />
            )}
          </IconButton>
        </Box>
      )}

      {/* Mobile Expandable Fields */}
      <Collapse in={!isMobile || isExpanded} sx={{ mt: 0 }}>
        <Box sx={{ 
          display: { xs: 'flex', sm: 'none' }, 
          flexDirection: 'column',
          gap: 0.5,
          pt: 0.5
        }}>
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
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
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
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
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
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
        </Box>
      </Collapse>
    </Box>
  );
}; 