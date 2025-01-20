import { City, Region, State } from '../types/api';
import { EnhancedCity, EnhancedRegion, EnhancedState } from '../types/enhanced';
import { getStateById, getTeamById } from './api';

export async function enhanceCity(city: City): Promise<EnhancedCity> {
  const [state, team] = await Promise.all([
    getStateById(city.stateId),
    city.nearestTeamId ? getTeamById(city.nearestTeamId) : null
  ]);

  return {
    ...city,
    state: state || null,
    nearestTeam: team
  };
}

export async function enhanceRegion(region: Region): Promise<EnhancedRegion> {
  const states = await Promise.all(
    region.stateIds.map(stateId => getStateById(stateId))
  );

  return {
    ...region,
    states: new Set(states.filter((s): s is State => s !== null)),
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