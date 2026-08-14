import { City, Region, State, SoccerTeam } from './api';

// Enhanced types with full object references
export interface EnhancedCity extends Omit<City, 'state' | 'nearestTeam'> {
  state: State | null;
  nearestTeam: SoccerTeam | null;
}

export interface EnhancedRegion extends Omit<Region, 'states'> {
  states: State[];
  cities: City[];
}

export interface EnhancedState extends State {
  regionIds: string[];
  regions: Region[];
  cities: City[];
} 
