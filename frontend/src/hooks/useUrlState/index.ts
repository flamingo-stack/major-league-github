import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UrlState {
  selectedCityId: string | null;
  selectedRegionId: string | null;
  stateId: string | null;
  teamId: string | null;
  languageId: string | null;
}

export const useUrlState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState: UrlState = {
    selectedCityId: searchParams.get('cityId'),
    selectedRegionId: searchParams.get('regionId'),
    stateId: searchParams.get('stateId'),
    teamId: searchParams.get('teamId'),
    languageId: searchParams.get('languageId'),
  };

  const updateUrlState = useCallback((newState: Partial<UrlState>) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newState).forEach(([key, value]) => {
      if (value === null) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, value);
      }
    });

    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  return { urlState, updateUrlState };
}; 