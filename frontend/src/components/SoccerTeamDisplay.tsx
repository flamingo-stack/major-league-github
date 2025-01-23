import { Box, Typography, Avatar } from '@mui/material';
import { SoccerTeam } from '../types/api';

interface SoccerTeamDisplayProps {
  team: SoccerTeam;
}

export const SoccerTeamDisplay = ({ team }: SoccerTeamDisplayProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar
        variant="square"
        src={team.logoUrl}
        alt={team.name}
        sx={{ 
          width: 24, 
          height: 24, 
          bgcolor: 'transparent',
          borderRadius: 0.5,
          '& img': {
            objectFit: 'contain'
          }
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {team.name}
      </Typography>
    </Box>
  );
}; 