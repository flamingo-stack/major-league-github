import axios from 'axios';
import { City, Region, State, Language, SoccerTeam, ApiResponse, Contributor } from '../types/api';
import { HiringManagerProfile, JobOpening } from '../types/hiring';

// Configure axios to use the backend URL from environment
const BACKEND_API_URL = process.env.BACKEND_API_URL || '/';
console.log('API Service: Using backend URL:', BACKEND_API_URL);

axios.defaults.baseURL = BACKEND_API_URL;

interface GetContributorsParams {
    cityId?: string;
    regionId?: string;
    stateId?: string;
    teamId?: string;
    languageId?: string;
    maxResults?: number;
    signal?: AbortSignal;
}

export async function getContributors({
    cityId,
    regionId,
    stateId,
    teamId,
    languageId,
    maxResults = 15,
    signal
}: GetContributorsParams): Promise<Contributor[]> {
    const params = new URLSearchParams();
    if (cityId) params.set('cityId', cityId);
    if (regionId) params.set('regionId', regionId);
    if (stateId) params.set('stateId', stateId);
    if (teamId) params.set('teamId', teamId);
    if (languageId) params.set('languageId', languageId);
    if (maxResults) params.set('maxResults', maxResults.toString());

    const response = await axios.get<ApiResponse<Contributor[]>>(`/api/contributors/search?${params.toString()}`, { signal });
    if (response.data.status !== 'success') {
        throw new Error(response.data.message);
    }
    return response.data.data;
}

export function downloadContributors({
    cityId,
    regionId,
    stateId,
    teamId,
    languageId,
    maxResults
}: Omit<GetContributorsParams, 'signal'>) {
    const params = new URLSearchParams();
    if (cityId) params.set('cityId', cityId);
    if (regionId) params.set('regionId', regionId);
    if (stateId) params.set('stateId', stateId);
    if (teamId) params.set('teamId', teamId);
    if (languageId) params.set('languageId', languageId);
    if (maxResults) params.set('maxResults', maxResults.toString());

    // Create a hidden link and click it to trigger the download
    const link = document.createElement('a');
    link.href = `${BACKEND_API_URL}/api/contributors/export?${params.toString()}`;
    link.download = 'contributors.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Autocomplete endpoints
export const autocompleteRegions = async (
  query: string,
  stateId: string | undefined,
  cityIds: string[] | undefined,
  signal?: AbortSignal
): Promise<Region[]> => {
  const response = await axios.get<ApiResponse<Region[]>>('/api/autocomplete/regions', {
    params: { 
      query, 
      stateId, 
      cityIds
    },
    signal,
    paramsSerializer: {
      indexes: null // This will prevent axios from adding the [] suffix
    }
  });
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const autocompleteStates = async (
  query: string,
  regionId?: string,
  cityIds?: string[],
  signal?: AbortSignal
): Promise<State[]> => {
  const response = await axios.get<ApiResponse<State[]>>('/api/autocomplete/states', {
    params: { 
      query,
      regionId,
      cityIds
    },
    signal,
    paramsSerializer: {
      indexes: null // This will prevent axios from adding the [] suffix
    }
  });
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const autocompleteCities = async (
  query: string,
  regionId: string | undefined,
  stateId: string | undefined,
  signal?: AbortSignal
): Promise<City[]> => {
  const response = await axios.get<ApiResponse<City[]>>('/api/autocomplete/cities', {
    params: { 
      query, 
      regionId, 
      stateId
    },
    signal
  });
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const autocompleteLanguages = async (
  query: string,
  signal?: AbortSignal
): Promise<Language[]> => {
  const response = await axios.get<ApiResponse<Language[]>>('/api/autocomplete/languages', {
    params: { 
      query
    },
    signal
  });
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const autocompleteTeams = async (
  query: string,
  signal?: AbortSignal
): Promise<SoccerTeam[]> => {
  const response = await axios.get<ApiResponse<SoccerTeam[]>>('/api/autocomplete/teams', {
    params: { 
      query
    },
    signal
  });
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

// Entity endpoints
export const getRegionById = async (id: string): Promise<Region> => {
  const response = await axios.get<ApiResponse<Region>>(`/api/entities/regions/${id}`);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const getStateById = async (id: string): Promise<State> => {
  const response = await axios.get<ApiResponse<State>>(`/api/entities/states/${id}`);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const getCityById = async (id: string): Promise<City> => {
  const response = await axios.get<ApiResponse<City>>(`/api/entities/cities/${id}`);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const getLanguageById = async (id: string): Promise<Language> => {
  const response = await axios.get<ApiResponse<Language>>(`/api/entities/languages/${id}`);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const getTeamById = async (id: string): Promise<SoccerTeam> => {
  const response = await axios.get<ApiResponse<SoccerTeam>>(`/api/entities/teams/${id}`);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

// Hiring endpoints
export const getHiringManagerProfile = async (): Promise<HiringManagerProfile> => {
  const response = await axios.get<ApiResponse<HiringManagerProfile>>('/api/hiring/manager');
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const getJobOpenings = async (): Promise<JobOpening[]> => {
  const response = await axios.get<ApiResponse<JobOpening[]>>('/api/hiring/jobs');
  if (response.data.status !== 'success') {
    throw new Error(response.data.message);
  }
  return response.data.data;
}; // Force rebuild Sun Aug 31 19:49:51 EDT 2025
