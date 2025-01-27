import { useQuery } from '@tanstack/react-query';
import { fetchHiringManagerProfile, fetchJobOpenings } from '../services/hiring';

export const useHiring = () => {
  const { 
    data: hiringManager,
    isLoading: isLoadingProfile,
    error: profileError
  } = useQuery({
    queryKey: ['hiringManager'],
    queryFn: fetchHiringManagerProfile
  });

  const {
    data: jobOpenings,
    isLoading: isLoadingJobs,
    error: jobsError
  } = useQuery({
    queryKey: ['jobOpenings'],
    queryFn: fetchJobOpenings
  });

  return {
    hiringManager,
    jobOpenings,
    isLoading: isLoadingProfile || isLoadingJobs,
    error: profileError || jobsError
  };
}; 