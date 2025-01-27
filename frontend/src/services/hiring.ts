import { HiringManagerProfile, JobOpening } from '../types/hiring';

const GITHUB_USERNAME = 'michaelassraf'; // Your GitHub username

export const fetchHiringManagerProfile = async (): Promise<HiringManagerProfile> => {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
  if (!response.ok) {
    throw new Error('Failed to fetch GitHub profile');
  }
  const data = await response.json();

  return {
    name: data.name || GITHUB_USERNAME,
    avatarUrl: data.avatar_url,
    role: 'Engineering Manager',
    bio: data.bio || 'Building the future of developer analytics. Looking for exceptional engineers to join our team.',
    socialLinks: [
      {
        platform: 'github',
        url: `https://github.com/${GITHUB_USERNAME}`,
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/michaelassraf', // Replace with your LinkedIn URL
      },
      {
        platform: 'twitter',
        url: 'https://twitter.com/michaelassraf', // Replace with your Twitter URL
      },
    ],
  };
};

// This would typically be an API call to your backend which would then fetch from LinkedIn's API
// For now, we'll use a mock implementation
export const fetchJobOpenings = async (): Promise<JobOpening[]> => {
  // This would be replaced with actual LinkedIn API integration
  return [
    {
      id: '1',
      title: 'Senior Full Stack Engineer',
      location: 'Remote',
      url: 'https://www.linkedin.com/jobs/view/xxx', // Replace with actual job posting URL
    },
    {
      id: '2',
      title: 'Senior Frontend Engineer',
      location: 'Remote',
      url: 'https://www.linkedin.com/jobs/view/yyy', // Replace with actual job posting URL
    },
  ];
}; 