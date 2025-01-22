import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Region, State } from '../types/api';
import { autocompleteRegions } from '../services/api';

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
    <Autocomplete<Region>
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, value, reason) => {
        // Always update input value for typing
        onInputChange(value);
      }}
      options={regions}
      getOptionLabel={(option) => option.displayName}
      fullWidth
      autoComplete
      handleHomeEndKeys
      selectOnFocus
      clearOnBlur={false}
      renderInput={(params) => (
        <TextField 
          {...(params as TextFieldProps)}
          placeholder="Search regions..."
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: value?.states && value.states.length > 0 ? (
              <InputAdornment position="start">
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {value.states.slice(0, 3).map((state) => (
                    state.iconUrl && (
                      <Box
                        key={state.id}
                        component="img"
                        src={state.iconUrl}
                        alt={state.name}
                        sx={{ 
                          width: 24, 
                          height: 16,
                          objectFit: 'cover',
                          borderRadius: 0.5
                        }}
                      />
                    )
                  ))}
                </Box>
              </InputAdornment>
            ) : null
          }}
        />
      )}
      renderOption={(props, region) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={region.id} {...otherProps}>
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
          </Box>
        );
      }}
    />
  );
}; 