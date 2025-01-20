import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Language } from '../types/api';
import { autocompleteLanguages } from '../services/api';

interface LanguageAutocompleteProps {
  value: Language | undefined;
  onChange: (language: Language | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

export const LanguageAutocomplete = ({
  value,
  onChange,
  inputValue,
  onInputChange
}: LanguageAutocompleteProps) => {
  const { data: languages = [] } = useQuery({
    queryKey: ['languages', inputValue],
    queryFn: ({ signal }) => autocompleteLanguages(inputValue, signal),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  return (
    <Autocomplete<Language>
      value={value || null}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, value) => onInputChange(value)}
      options={languages}
      getOptionLabel={(option) => option.displayName}
      renderInput={(params) => (
        <TextField 
          {...(params as TextFieldProps)}
          placeholder="Search languages..."
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: value?.iconUrl ? (
              <InputAdornment position="start">
                <Box
                  component="img"
                  src={value.iconUrl}
                  alt={value.displayName}
                  sx={{ 
                    width: 24, 
                    height: 24,
                    objectFit: 'contain'
                  }}
                />
              </InputAdornment>
            ) : null
          }}
        />
      )}
      renderOption={(props, language) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={language.id} {...otherProps} sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {language.iconUrl && (
                <Box
                  component="img"
                  src={language.iconUrl}
                  alt={language.displayName}
                  sx={{ 
                    width: 24, 
                    height: 24,
                    objectFit: 'contain'
                  }}
                />
              )}
              <Typography>
                {language.displayName}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}; 