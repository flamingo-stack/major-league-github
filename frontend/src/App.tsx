import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import { getTheme } from './theme';
import { Layout } from './components/Layout';
import { FiltersPanel } from './components/FiltersPanel';
import { ContributorsTable } from './components/ContributorsTable/index';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useUrlState } from './hooks/useUrlState';
import { getContributors } from './services/api';
import { Contributor } from './types/contributor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false
    }
  }
});

const MainApp = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Initialize theme from localStorage or system preference
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode ? (savedMode as 'light' | 'dark') : (prefersDarkMode ? 'dark' : 'light');
  });
  
  // Save theme mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);
  
  const theme = useMemo(() => getTheme(mode), [mode]);

  const { urlState } = useUrlState();

  useEffect(() => {
    console.log('App: URL state changed:', urlState);
  }, [urlState]);

  const { data: contributors = [], isLoading, error } = useQuery({
    queryKey: [
      'contributors', 
      urlState.selectedCityId,
      urlState.selectedRegionId, 
      urlState.stateId,
      urlState.languageId,
      urlState.teamId
    ],
    queryFn: ({ signal }) => {
      console.log('Fetching contributors with params:', {
        cityId: urlState.selectedCityId,
        regionId: urlState.selectedRegionId,
        stateId: urlState.stateId,
        languageId: urlState.languageId,
        teamId: urlState.teamId
      });
      return getContributors({
        cityId: urlState.selectedCityId || undefined,
        regionId: urlState.selectedRegionId || undefined,
        stateId: urlState.stateId || undefined,
        languageId: urlState.languageId || undefined,
        teamId: urlState.teamId || undefined,
        maxResults: 15,
        signal
      });
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const handleToggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onToggleTheme={handleToggleTheme}>
        <FiltersPanel />
        <ContributorsTable
          contributors={contributors}
          isLoading={isLoading}
          error={error as Error}
        />
      </Layout>
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MainApp />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
