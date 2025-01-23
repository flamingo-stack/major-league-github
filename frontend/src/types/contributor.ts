import { SoccerTeam, City } from '../types/api';

export interface Contributor {
    login: string;
    name: string | null;
    avatarUrl: string;
    url: string;
    totalCommits: number;
    starsReceived: number;
    starsGiven: number;
    forksReceived: number;
    forksGiven: number;
    javaRepos: number;
    latestCommitDate: string;
    score: number;
    city: City;
    nearestTeam: SoccerTeam | null;
    location: string | null;
    contributions: number;
} 