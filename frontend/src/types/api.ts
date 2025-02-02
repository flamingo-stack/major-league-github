import { SocialLink } from './hiring';

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

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

export interface Contributor {
    id: string;
    login: string;
    name: string | null;
    avatarUrl: string;
    url: string;
    email: string | null;
    role: string;
    bio: string;
    type: 'CONTRIBUTOR' | 'HIRING_MANAGER';
    socialLinks: SocialLink[];
    cityId: string;
    nearestTeamId: string;
    city: City;
    nearestTeam: SoccerTeam | null;
    githubStats: {
        score: number;
        totalCommits: number;
        starsGiven: number;
        starsReceived: number;
        forksReceived: number;
        forksGiven: number;
        javaRepos: number;
    };
    lastActive: number;  // Unix timestamp in seconds
    totalCommits: number;
    javaRepos: number;
    starsReceived: number;
    forksReceived: number;
    starsGiven: number;
    forksGiven: number;
    score: number;
} 