import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment, useTheme, useMediaQuery, SxProps, Theme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SoccerTeam } from '../types/api';
import { autocompleteTeams } from '../services/api';

interface TeamAutocompleteProps {
  value: SoccerTeam | null;
  onChange: (team: SoccerTeam | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

export const TeamAutocomplete = ({
  value,
  onChange,
  inputValue,
  onInputChange
}: TeamAutocompleteProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data: teams = [] } = useQuery({
    queryKey: ['teams', inputValue],
    queryFn: ({ signal }) => autocompleteTeams(inputValue, signal),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  return (
    <Autocomplete<SoccerTeam>
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, value, reason) => {
        // Always update input value for typing
        onInputChange(value);
      }}
      options={teams}
      getOptionLabel={(option) => option.name}
      fullWidth
      disablePortal={isMobile}
      autoComplete
      handleHomeEndKeys
      selectOnFocus
      clearOnBlur={false}
      sx={{
        '& .MuiAutocomplete-paper': {
          maxHeight: isMobile ? '60vh' : '400px',
        },
        '& .MuiInputBase-root': {
          height: '56px' // Standard Material-UI height
        }
      }}
      renderInput={(params) => {
        const customInputProps = {
          ...params.InputProps,
          startAdornment: value?.logoUrl ? (
            <InputAdornment position="start">
              <Box
                component="img"
                src={value.logoUrl}
                alt={value.name}
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
            placeholder="Search teams..."
            fullWidth
            variant="outlined"
            InputProps={customInputProps}
            onFocus={(e) => e.target.select()}
            onSelect={(e) => (e.target as HTMLInputElement).select()}
          />
        );
      }}
      renderOption={(props, team) => {
        const { key, ...otherProps } = props;
        return (
          <Box 
            component="li" 
            key={team.id} 
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
              {team.logoUrl && (
                <Box
                  component="img"
                  src={team.logoUrl}
                  alt={team.name}
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
                  {team.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    fontSize: isMobile ? '14px' : '12px'
                  }}
                  noWrap
                >
                  {team.city}, {team.state}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }}
    />
  );
}; 