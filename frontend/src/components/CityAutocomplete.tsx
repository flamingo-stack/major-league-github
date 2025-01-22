import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { City } from '../types/api';
import { autocompleteCities } from '../services/api';

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
    <Autocomplete<City>
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, value, reason) => {
        // Always update input value for typing
        onInputChange(value);
      }}
      options={cities}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField 
          {...(params as TextFieldProps)}
          placeholder="Search cities..."
          fullWidth
          variant="outlined"
          onFocus={(e) => e.target.select()}
          onSelect={(e) => (e.target as HTMLInputElement).select()}
          InputProps={{
            ...params.InputProps,
            startAdornment: value?.state?.iconUrl ? (
              <InputAdornment position="start">
                <Box
                  component="img"
                  src={value.state.iconUrl}
                  alt={value.state.name}
                  sx={{ 
                    width: 24, 
                    height: 16,
                    objectFit: 'cover',
                    borderRadius: 0.5
                  }}
                />
              </InputAdornment>
            ) : null
          }}
        />
      )}
      renderOption={(props, city) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={city.id} {...otherProps} sx={{ py: 1.5 }}>
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
          </Box>
        );
      }}
      fullWidth
      autoComplete
      handleHomeEndKeys
      selectOnFocus
      clearOnBlur={false}
    />
  );
}; 