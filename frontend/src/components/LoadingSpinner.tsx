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
          color: theme => theme.palette.mode === 'dark' ? '#58a6ff' : '#0969da'
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}; 