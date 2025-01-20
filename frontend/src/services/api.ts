import axios from 'axios';
import { City, Region, State, Language, SoccerTeam } from '../types/api';

export interface Contributor {
    login: string;
    name: string;
    url: string;
    avatarUrl: string;
    totalCommits: number;
    javaRepos: number;
    starsReceived: number;
    starsGiven: number;
    forksReceived: number;
    forksGiven: number;
    latestCommitDate: string;
    score: number;
    cityId: string;
    nearestTeamId?: string;
    city: City;
    nearestTeam?: SoccerTeam;
}

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

    const response = await fetch(`/api/contributors?${params.toString()}`, { signal });
    if (!response.ok) {
        throw new Error('Failed to fetch contributors');
    }
    return response.json();
}

// Autocomplete endpoints
export const autocompleteRegions = async (
  query: string,
  stateId: string | undefined,
  cityIds: string[] | undefined,
  signal?: AbortSignal
): Promise<Region[]> => {
  const response = await axios.get<Region[]>('/api/autocomplete/regions', {
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
  return response.data;
};

export const autocompleteStates = async (
  query: string,
  regionId?: string,
  cityIds?: string[],
  signal?: AbortSignal
): Promise<State[]> => {
  const response = await axios.get<State[]>('/api/autocomplete/states', {
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
  return response.data;
};

export const autocompleteCities = async (
  query: string,
  regionId: string | undefined,
  stateId: string | undefined,
  signal?: AbortSignal
): Promise<City[]> => {
  const response = await axios.get<City[]>('/api/autocomplete/cities', {
    params: { 
      query, 
      regionId, 
      stateId
    },
    signal
  });
  return response.data;
};

export const autocompleteLanguages = async (
  query: string,
  signal?: AbortSignal
): Promise<Language[]> => {
  const response = await axios.get<Language[]>('/api/autocomplete/languages', {
    params: { 
      query
    },
    signal
  });
  return response.data;
};

export const autocompleteTeams = async (
  query: string,
  signal?: AbortSignal
): Promise<SoccerTeam[]> => {
  const response = await axios.get<SoccerTeam[]>('/api/autocomplete/teams', {
    params: { 
      query
    },
    signal
  });
  return response.data;
};

// Entity endpoints
export const getRegionById = async (id: string): Promise<Region> => {
  const response = await axios.get<Region>(`/api/entities/regions/${id}`);
  return response.data;
};

export const getStateById = async (id: string): Promise<State> => {
  const response = await axios.get<State>(`/api/entities/states/${id}`);
  return response.data;
};

export const getCityById = async (id: string): Promise<City> => {
  const response = await axios.get<City>(`/api/entities/cities/${id}`);
  return response.data;
};

export const getLanguageById = async (id: string): Promise<Language> => {
  const response = await axios.get<Language>(`/api/entities/languages/${id}`);
  return response.data;
};

export const getTeamById = async (id: string): Promise<SoccerTeam> => {
  const response = await axios.get<SoccerTeam>(`/api/entities/teams/${id}`);
  return response.data;
}; 