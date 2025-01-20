import { AppBar, Box, Container, IconButton, Toolbar, Typography, useTheme, Button } from '@mui/material';
import { GitHub, LightMode, DarkMode } from '@mui/icons-material';

interface LayoutProps {
  children: any;
  onToggleTheme: () => void;
}

export const Layout = ({ children, onToggleTheme }: LayoutProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: theme.palette.background.paper
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            sx={{ 
              gap: 2,
              minHeight: '64px',
              px: { xs: 2, sm: 3 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <GitHub sx={{ 
                fontSize: 32,
                color: theme.palette.mode === 'dark' ? 'white' : 'black'
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  color: theme.palette.mode === 'dark' ? 'white' : 'black'
                }}
              >
                Major League Github
              </Typography>
            </Box>
            <Button
              variant="text"
              color="inherit"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary'
                }
              }}
            >
              View on GitHub
            </Button>
            <IconButton 
              onClick={onToggleTheme} 
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      
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