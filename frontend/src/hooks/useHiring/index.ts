import { useQuery } from '@tanstack/react-query';
import { fetchHiringManagerProfile, fetchJobOpenings } from '../../services/hiring';

export const useHiring = () => {
  const { 
    data: hiringManager,
    isLoading: isLoadingProfile,
    error: profileError
  } = useQuery({
    queryKey: ['hiringManager'],
    queryFn: fetchHiringManagerProfile,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if we got a clear error message
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    }
  });

  const {
    data: jobOpenings,
    isLoading: isLoadingJobs,
    error: jobsError
  } = useQuery({
    queryKey: ['jobOpenings'],
    queryFn: fetchJobOpenings,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if we got a clear error message
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    }
  });

  return {
    hiringManager,
    jobOpenings,
    isLoading: isLoadingProfile || isLoadingJobs,
    error: profileError || jobsError
  };
}; 