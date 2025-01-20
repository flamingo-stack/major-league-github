import { Box, Typography, Autocomplete, TextField, TextFieldProps, InputAdornment } from '@mui/material';
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
      onInputChange={(_, value) => onInputChange(value)}
      options={teams}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField 
          {...(params as TextFieldProps)}
          placeholder="Search teams..."
          fullWidth
          variant="outlined"
          InputProps={{
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
                    objectFit: 'cover'
                  }}
                />
              </InputAdornment>
            ) : null
          }}
        />
      )}
      renderOption={(props, team) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={team.id} {...otherProps} sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {team.logoUrl && (
                <Box
                  component="img"
                  src={team.logoUrl}
                  alt={team.name}
                  sx={{ 
                    width: 24, 
                    height: 24,
                    objectFit: 'cover'
                  }}
                />
              )}
              <Box>
                <Typography>
                  {team.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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