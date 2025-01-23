import { Box, Container } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: any;
  onToggleTheme: () => void;
}

export const Layout = ({ children, onToggleTheme }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onToggleTheme={onToggleTheme} />
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {children}
      </Container>
    </Box>
  );
}; 