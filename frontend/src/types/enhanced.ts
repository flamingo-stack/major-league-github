import { City, Region, State, SoccerTeam } from './api';

// Enhanced types with full object references
export interface EnhancedCity extends Omit<City, 'state' | 'nearestTeam'> {
  state: State | null;
  nearestTeam: SoccerTeam | null;
}

export interface EnhancedRegion extends Omit<Region, 'states'> {
  states: Set<State>;
  cities: Set<City>;
}

export interface EnhancedState extends State {
  regionIds: string[];
  regions: Set<Region>;
  cities: Set<City>;
} 