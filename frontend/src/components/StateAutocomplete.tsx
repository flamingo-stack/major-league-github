import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { State } from '../types/api';
import { autocompleteStates } from '../services/api';

interface StateAutocompleteProps {
  value: State | null;
  onChange: (state: State | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  regionId?: string;
}

export const StateAutocomplete = ({
  value,
  onChange,
  inputValue,
  onInputChange,
  regionId
}: StateAutocompleteProps) => {
  const { data: states = [] } = useQuery({
    queryKey: ['states', inputValue, regionId],
    queryFn: ({ signal }) => autocompleteStates(inputValue, regionId, undefined, signal),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  return (
    <Autocomplete<State>
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, value) => onInputChange(value)}
      options={states}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField 
          {...(params as TextFieldProps)}
          placeholder="Search states..."
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: value?.iconUrl ? (
              <InputAdornment position="start">
                <Box
                  component="img"
                  src={value.iconUrl}
                  alt={value.name}
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
      renderOption={(props, state) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={state.id} {...otherProps} sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {state.iconUrl && (
                <Box
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
              )}
              <Typography>
                {state.name}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}; 