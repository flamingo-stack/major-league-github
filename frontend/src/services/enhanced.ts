import { ApiResponse, City, Region, SoccerTeam, State } from '../types/api';
import { EnhancedCity, EnhancedRegion, EnhancedState } from '../types/enhanced';
import { getStateById, getTeamById } from './api';

async function fetchState(stateId: string): Promise<State> {
  const response: ApiResponse<State> = await getStateById(stateId);
  if (response.data.status !== 'success') {
    throw new Error(`Failed to fetch state ${stateId}: ${response.data.status}`);
  }
  return response.data.data;
}

async function fetchTeam(teamId: string): Promise<SoccerTeam> {
  const response: ApiResponse<SoccerTeam> = await getTeamById(teamId);
  if (response.data.status !== 'success') {
    throw new Error(`Failed to fetch team ${teamId}: ${response.data.status}`);
  }
  return response.data.data;
}

const CONCURRENCY_LIMIT = 5;

async function fetchStatesWithLimit(stateIds: string[]): Promise<State[]> {
  const results: State[] = [];
  for (let i = 0; i < stateIds.length; i += CONCURRENCY_LIMIT) {
    const batch = stateIds.slice(i, i + CONCURRENCY_LIMIT);
    const batchResults = await Promise.all(batch.map(id => fetchState(id)));
    results.push(...batchResults);
  }
  return results;
}

export async function enhanceCity(city: City): Promise<EnhancedCity> {
  const [state, team] = await Promise.all([
    fetchState(city.stateId),
    city.nearestTeamId ? fetchTeam(city.nearestTeamId) : Promise.resolve(null)
  ]);

  return {
    ...city,
    state: state,
    nearestTeam: team
  };
}

export async function enhanceRegion(region: Region): Promise<EnhancedRegion> {
  const states = await fetchStatesWithLimit(region.stateIds);

  return {
    ...region,
    states: new Set(states),
    cities: new Set()
  };
}

export async function enhanceState(state: State): Promise<EnhancedState> {
  return {
    ...state,
    regionIds: state.regionIds,
    regions: new Set(),
    cities: new Set()
  };
}
