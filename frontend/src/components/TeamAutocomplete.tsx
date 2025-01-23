import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SoccerTeam } from '../types/api';
import { autocompleteTeams } from '../services/api';
import { BaseAutocomplete } from './BaseAutocomplete';

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
    <BaseAutocomplete<SoccerTeam>
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={teams}
      placeholder="Search teams..."
      getOptionLabel={(option) => option.name}
      renderIcon={(option) => option.logoUrl}
      renderOptionContent={(team) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {team.logoUrl && (
              <Box
                component="img"
                src={team.logoUrl}
                alt={team.name}
                sx={{ width: 24, height: 24, objectFit: 'contain' }}
              />
            )}
            <Typography variant="subtitle1">
              {team.name}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {team.city}, {team.state}
          </Typography>
        </Box>
      )}
    />
  );
}; 