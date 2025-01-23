import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Region, State } from '../types/api';
import { autocompleteRegions } from '../services/api';
import { BaseAutocomplete } from './BaseAutocomplete';

interface RegionAutocompleteProps {
  value: Region | null;
  onChange: (region: Region | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  stateId?: string;
  cityIds?: string[];
}

export const RegionAutocomplete = ({
  value,
  onChange,
  inputValue,
  onInputChange,
  stateId,
  cityIds
}: RegionAutocompleteProps) => {
  const { data: regions = [] } = useQuery({
    queryKey: ['regions', inputValue, stateId, cityIds],
    queryFn: ({ signal }) => autocompleteRegions(
      inputValue,
      stateId,
      cityIds,
      signal
    ),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  return (
    <BaseAutocomplete<Region>
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={regions}
      placeholder="Search regions..."
      getOptionLabel={(option) => option.displayName}
      renderIcon={(region) => region.states?.[0]?.iconUrl}
      renderOptionContent={(region) => (
        <Box sx={{ py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {region.displayName}
          </Typography>
          {region.states && region.states.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {region.states.map((state: State) => (
                <Box key={state.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {state.iconUrl && (
                    <Box
                      component="img"
                      src={state.iconUrl}
                      alt={state.name}
                      sx={{ width: 20, height: 20, objectFit: 'contain' }}
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {state.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    />
  );
}; 