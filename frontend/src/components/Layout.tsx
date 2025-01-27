import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { FiltersPanel } from './FiltersPanel';
import { ContributorsTable } from './ContributorsTable';
import { HiringSection } from './HiringSection';
import { useContributors } from '../hooks/useContributors';
import { useHiring } from '../hooks/useHiring';
import Header from './Header';

interface LayoutProps {
  children?: React.ReactNode;
  onToggleTheme: () => void;
}

export const Layout = ({ children, onToggleTheme }: LayoutProps) => {
  const theme = useTheme();
  const { contributors = [], isLoading: isLoadingContributors, error: contributorsError } = useContributors();
  const { hiringManager, jobOpenings, isLoading: isLoadingHiring } = useHiring();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: theme => theme.palette.mode === 'dark' ? '#0d1117' : '#ffffff',
      }}
    >
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
        <FiltersPanel />
        <ContributorsTable
          contributors={contributors}
          isLoading={isLoadingContributors}
          error={contributorsError}
        />
        {!isLoadingHiring && hiringManager && jobOpenings && (
          <HiringSection
            hiringManager={hiringManager}
            jobOpenings={jobOpenings}
          />
        )}
        {children}
      </Container>
    </Box>
  );
}; 