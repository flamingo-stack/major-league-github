import { Box, CircularProgress, Typography } from '@mui/material';

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
          color: '#58a6ff'
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}; 