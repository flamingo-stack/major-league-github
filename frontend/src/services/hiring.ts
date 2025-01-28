import { HiringManagerProfile, JobOpening } from '../types/hiring';

const GITHUB_USERNAME = 'michaelassraf';

export const fetchHiringManagerProfile = async (): Promise<HiringManagerProfile> => {
  return {
    name: 'Michael Assraf',
    avatarUrl: 'https://avatars.githubusercontent.com/u/6730584?v=4',
    role: 'Engineering Manager',
    bio: 'Building OpenFrame - the open-source platform helping MSPs break free from vendor lock-in.',
    socialLinks: [
      {
        platform: 'github',
        url: `https://github.com/${GITHUB_USERNAME}`,
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/michaelassraf',
      },
      {
        platform: 'twitter',
        url: 'https://twitter.com/michaelassraf',
      },
    ],
    lastActive: new Date().toISOString(),
  };
};

export const fetchJobOpenings = async (): Promise<JobOpening[]> => {
  return [
    {
      id: 'founding-engineer-1',
      title: 'Founding Engineer',
      location: 'Miami, FL',
      url: 'https://www.linkedin.com/jobs/view/4116487922',
    },
    {
      id: 'founding-engineer-2',
      title: 'Founding Engineer',
      location: 'Miami, FL',
      url: 'https://www.linkedin.com/jobs/view/4116487922',
    },
  ];
}; 