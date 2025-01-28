import { useQuery } from '@tanstack/react-query';
import { getHiringManagerProfile, getJobOpenings } from '../services/api';

export const useHiring = () => {
  const { 
    data: hiringManager,
    isLoading: isLoadingManager,
    error: managerError
  } = useQuery({
    queryKey: ['hiringManager'],
    queryFn: getHiringManagerProfile,
    retry: 1
  });

  const {
    data: jobOpenings,
    isLoading: isLoadingJobs,
    error: jobsError
  } = useQuery({
    queryKey: ['jobOpenings'],
    queryFn: getJobOpenings,
    retry: 1
  });

  return {
    hiringManager,
    jobOpenings: jobOpenings || [],
    isLoading: isLoadingManager || isLoadingJobs,
    error: managerError || jobsError
  };
}; 