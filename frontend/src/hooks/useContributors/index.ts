import { useQuery } from '@tanstack/react-query';
import { useUrlState } from '../useUrlState';
import { Contributor } from '../../types/api';
import { getContributors } from '../../services/api';

export const useContributors = () => {
  const { urlState } = useUrlState();

  const { 
    data: contributors,
    isLoading,
    error
  } = useQuery({
    queryKey: ['contributors', urlState],
    queryFn: () => getContributors({
      cityId: urlState.selectedCityId || undefined,
      regionId: urlState.selectedRegionId || undefined,
      stateId: urlState.stateId || undefined,
      teamId: urlState.teamId || undefined,
      languageId: urlState.languageId || undefined,
      maxResults: 15
    }),
    enabled: !!urlState.languageId, // Only fetch if we have a language selected
    retry: (failureCount, error) => {
      // Don't retry if we got a clear error message about cache population
      if (error instanceof Error && 
         (error.message.includes('Server is currently unavailable') ||
          error.message.includes('Cache is still being populated'))) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    contributors,
    isLoading,
    error
  };
}; 