import { Box, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
        backgroundColor: 'rgba(248, 81, 73, 0.15)',
        border: '1px solid',
        borderColor: 'rgba(248, 81, 73, 0.4)',
        borderRadius: '6px',
        width: '100%',
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          color: 'rgb(248, 81, 73)'
        }} 
      />
      <Typography
        variant="body1"
        sx={{
          color: 'rgb(255, 123, 114)',
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Paper>
  );
}; 