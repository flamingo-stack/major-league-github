import { City, Region, State } from '../types/api';
import { EnhancedCity, EnhancedRegion, EnhancedState } from '../types/enhanced';
import { getStateById, getTeamById } from './api';

async function getStateByIdChecked(stateId: string): Promise<State> {
  const response = await getStateById(stateId);
  if (!response || (response as any).status !== 'success') {
    throw new Error(`getStateById(${stateId}) returned non-success status`);
  }
  return response;
}

async function getTeamByIdChecked(teamId: string) {
  const response = await getTeamById(teamId);
  if (!response || (response as any).status !== 'success') {
    throw new Error(`getTeamById(${teamId}) returned non-success status`);
  }
  return response;
}

export async function enhanceCity(city: City): Promise<EnhancedCity> {
  const [state, team] = await Promise.all([
    getStateByIdChecked(city.stateId),
    city.nearestTeamId ? getTeamByIdChecked(city.nearestTeamId) : null
  ]);

  return {
    ...city,
    state: state,
    nearestTeam: team
  };
}

export async function enhanceRegion(region: Region): Promise<EnhancedRegion> {
  const states = await Promise.all(
    region.stateIds.map(stateId => getStateByIdChecked(stateId))
  );

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
