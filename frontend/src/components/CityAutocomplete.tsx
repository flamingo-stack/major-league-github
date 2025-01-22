import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { City } from '../types/api';
import { autocompleteCities } from '../services/api';
import { BaseAutocomplete } from './BaseAutocomplete';

interface CityAutocompleteProps {
  value: City | null;
  onChange: (city: City | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  regionId?: string;
  stateId?: string;
}

export const CityAutocomplete = ({
  value,
  onChange,
  inputValue,
  onInputChange,
  regionId,
  stateId
}: CityAutocompleteProps) => {
  const { data: cities = [] } = useQuery({
    queryKey: ['cities', inputValue, regionId, stateId],
    queryFn: ({ signal }) => autocompleteCities(
      inputValue,
      regionId,
      stateId,
      signal
    ),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  return (
    <BaseAutocomplete<City>
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={cities}
      placeholder="Search cities..."
      getOptionLabel={(option) => option.name}
      renderIcon={(city) => city.state?.iconUrl}
      renderOptionContent={(city) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body1">
            {city.name}
          </Typography>
          {city.state && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              {city.state.iconUrl && (
                <Box
                  component="img"
                  src={city.state.iconUrl}
                  alt={city.state.name}
                  sx={{ 
                    width: 24, 
                    height: 16,
                    objectFit: 'cover',
                    borderRadius: 0.5
                  }}
                />
              )}
              <Typography variant="caption" color="text.secondary">
                {city.state.name}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    />
  );
}; 