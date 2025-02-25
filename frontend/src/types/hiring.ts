export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'x' | 'github' | 'facebook' | 'instagram' | 'mastodon' | 'bluesky' | 'email' | 'website';
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
  githubStats: {
    score: number;
    totalCommits: number;
    starsGiven: number;
    starsReceived: number;
    forksReceived: number;
    forksGiven: number;
    javaRepos: number;
    totalPullRequests: number;
    totalIssues: number;
  };
  lastActive: number;
} 