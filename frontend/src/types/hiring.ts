export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'github' | 'facebook' | 'instagram' | 'email' | 'website';
  url: string;
}

export interface JobOpening {
  id: string;
  title: string;
  location: string;
  url: string;
}

export interface HiringManagerProfile {
  name: string;
  avatarUrl: string;
  role: string;
  bio: string;
  socialLinks: SocialLink[];
  githubStats?: {
    score: number;
    totalCommits: number;
    javaRepos: number;
    starsReceived: number;
    forksReceived: number;
    starsGiven: number;
    forksGiven: number;
    totalPullRequests: number;
    totalIssues: number;
  };
  lastActive: string;
} 