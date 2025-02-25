import { JobOpening } from '../types/hiring';
import { getJobOpenings } from './api';

export const fetchJobOpenings = async (): Promise<JobOpening[]> => {
  try {
    // Use the API service to fetch job openings from the backend
    return await getJobOpenings();
  } catch (error) {
    console.error('Error fetching job openings:', error);
    // Return empty array in case of error
    return [];
  }
}; 