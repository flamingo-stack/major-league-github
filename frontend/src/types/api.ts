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
    bio: string | null;
    location: string | null;
    email: string | null;
    company: string | null;
    blog: string | null;
    twitterUsername: string | null;
    followers: number;
    following: number;
    score: number;
    totalCommits: number;
    javaRepos: number;
    starsReceived: number;
    starsGiven: number;
    forksReceived: number;
    forksGiven: number;
    latestCommitDate: string;
    cityId: string | null;
    stateId: string | null;
    regionId: string | null;
    teamId: string | null;
} 