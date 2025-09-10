import { Box, CircularProgress, Typography } from '@mui/material';
import { flamingo, systemGreys } from '../styles/colors';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: '200px',
        width: '100%'
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: flamingo.cyan_light // Using ODS flamingo cyan light instead of hardcoded blue
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: systemGreys.grey_hover, // Using ODS grey hover instead of hardcoded rgba
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}; 