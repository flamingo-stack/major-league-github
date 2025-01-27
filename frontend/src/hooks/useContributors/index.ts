import { useQuery } from '@tanstack/react-query';
import { useUrlState } from '../useUrlState';
import { Contributor } from '../../types/api';

const fetchContributors = async (
  cityId: string | null,
  regionId: string | null,
  stateId: string | null,
  teamId: string | null,
  languageId: string | null
): Promise<Contributor[]> => {
  const params = new URLSearchParams();
  if (cityId) params.append('cityId', cityId);
  if (regionId) params.append('regionId', regionId);
  if (stateId) params.append('stateId', stateId);
  if (teamId) params.append('teamId', teamId);
  if (languageId) params.append('languageId', languageId);

  const response = await fetch(`/api/contributors?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contributors');
  }
  return response.json();
};

export const useContributors = () => {
  const { urlState } = useUrlState();

  const { 
    data: contributors,
    isLoading,
    error
  } = useQuery({
    queryKey: ['contributors', urlState],
    queryFn: () => fetchContributors(
      urlState.selectedCityId,
      urlState.selectedRegionId,
      urlState.stateId,
      urlState.teamId,
      urlState.languageId
    ),
    enabled: !!urlState.languageId // Only fetch if we have a language selected
  });

  return {
    contributors,
    isLoading,
    error
  };
}; 