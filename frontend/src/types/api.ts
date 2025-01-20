export interface City {
    id: string;
    name: string;
    stateId: string;
    population: number;
    latitude: number;
    longitude: number;
    regionIds: string[];
    nearestTeamId: string | null;
    // Reference objects
    state?: State;
    nearestTeam?: SoccerTeam;
}

export interface Region {
    id: string;
    name: string;
    displayName: string;
    geo: {
        latitude: number;
        longitude: number;
    };
    stateIds: string[];
    // Reference objects
    states?: State[];
}

export interface State {
    id: string;
    name: string;
    code: string;
    displayName: string;
    iconUrl: string;
    regionIds: string[];
}

export interface Language {
    id: string;
    name: string;
    displayName: string;
    iconUrl: string;
}

export interface SoccerTeam {
    id: string;
    name: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    league: string;
    stadium: string;
    stadiumCapacity: number;
    joinedYear: number;
    headCoach: string;
    teamUrl: string;
    wikipediaUrl: string;
    logoUrl: string;
} 