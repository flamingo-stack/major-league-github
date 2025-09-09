import { CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo, useEffect } from 'react';
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
  const theme = useMemo(() => getTheme(), []);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
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
