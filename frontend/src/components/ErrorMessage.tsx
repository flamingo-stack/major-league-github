import { Box, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { attention } from '../styles/colors';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: `${attention.red_error}26`, // Using ODS red error with 15% opacity
        border: '1px solid',
        borderColor: `${attention.red_error}66`, // Using ODS red error with 40% opacity
        borderRadius: '6px',
        width: '100%',
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          color: attention.red_error // Using ODS red error
        }} 
      />
      <Typography
        variant="body1"
        sx={{
          color: attention.red_error_hover, // Using ODS red error hover for text
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Paper>
  );
}; 