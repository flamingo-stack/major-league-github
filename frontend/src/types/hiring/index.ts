export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'github';
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
} 