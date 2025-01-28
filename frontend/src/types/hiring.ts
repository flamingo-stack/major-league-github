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
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    totalRepositories: number;
    totalPullRequests: number;
    totalIssues: number;
  };
} 