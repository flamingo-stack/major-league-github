import React from 'react';
import { Box, Container } from '@mui/material';
import { HiringSection } from './HiringSection';
import { useHiring } from '../hooks/useHiring';
import Header from './Header';
import { HeroSection } from './HeroSection';
import { odsColors } from '@flamingo/ui-kit/styles/ods-colors';

interface LayoutProps {
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ onToggleTheme, children }) => {
  const { hiringManager, jobOpenings, isLoading: isLoadingHiring } = useHiring();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: theme => theme.palette.mode === 'dark' ? odsColors.background : odsColors.grey,
        position: 'relative',
      }}
    >
      <Header onToggleTheme={onToggleTheme} />
      <HeroSection />
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1,
          py: 4,
          px: { xs: 1, sm: 1.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mb: '200px' // Add space for the sticky footer
        }}
      >
        {children}
      </Container>
      {!isLoadingHiring && hiringManager && jobOpenings && (
        <Box
          data-testid="footer"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: theme => theme.palette.mode === 'dark' ? odsColors.background : odsColors.grey,
            borderTop: '1px solid',
            borderColor: theme => theme.palette.mode === 'dark' ? '#30363d' : 'rgba(27, 31, 36, 0.15)',
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '0 -4px 12px rgba(0, 0, 0, 0.3)'
              : '0 -4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 2000,
          }}
        >
          <Container maxWidth="xl">
            <HiringSection
              hiringManager={hiringManager}
              jobOpenings={jobOpenings}
            />
          </Container>
        </Box>
      )}
    </Box>
  );
}; 