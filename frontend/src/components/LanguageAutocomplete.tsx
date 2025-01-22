import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment, useTheme, useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      fullWidth
      disablePortal={isMobile}
      sx={{
        '& .MuiAutocomplete-paper': {
          maxHeight: isMobile ? '60vh' : '400px',
        },
        '& .MuiInputBase-root': {
          height: '56px', // Standard Material-UI height
        }
      }}
      renderInput={(params) => {
        const customInputProps = {
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
        };

        return (
          <TextField 
            {...(params as TextFieldProps)}
            placeholder="Search languages..."
            fullWidth
            variant="outlined"
            InputProps={customInputProps}
          />
        );
      }}
      renderOption={(props, language) => {
        const { key, ...otherProps } = props;
        return (
          <Box 
            component="li" 
            key={language.id} 
            {...otherProps} 
            sx={{ 
              py: isMobile ? 2 : 1.5,
              px: isMobile ? 2 : 1,
              minHeight: isMobile ? '48px' : '40px'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? 2 : 1,
              width: '100%'
            }}>
              {language.iconUrl && (
                <Box
                  component="img"
                  src={language.iconUrl}
                  alt={language.displayName}
                  sx={{ 
                    width: isMobile ? 32 : 24, 
                    height: isMobile ? 32 : 24,
                    objectFit: 'contain',
                    flexShrink: 0
                  }}
                />
              )}
              <Box sx={{ 
                flex: 1,
                minWidth: 0 // Enables text truncation
              }}>
                <Typography noWrap>
                  {language.displayName}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }}
    />
  );
}; 