import { Box, Paper, Typography, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(248, 81, 73, 0.15)' // Dark mode error background
          : 'rgba(248, 81, 73, 0.1)', // Light mode error background
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(248, 81, 73, 0.4)' // Dark mode border
          : 'rgba(248, 81, 73, 0.3)', // Light mode border
        borderRadius: '6px',
        width: '100%',
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          color: theme.palette.mode === 'dark' 
            ? 'rgb(248, 81, 73)' // Dark mode icon
            : 'rgb(207, 34, 46)' // Light mode icon
        }} 
      />
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.mode === 'dark'
            ? 'rgb(255, 123, 114)' // Dark mode text
            : 'rgb(207, 34, 46)', // Light mode text
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Paper>
  );
}; 