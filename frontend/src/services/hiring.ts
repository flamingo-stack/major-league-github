import { JobOpening } from '../types/hiring';
import { getJobOpenings } from './api';

export const fetchJobOpenings = async (): Promise<JobOpening[]> => {
  // Use the API service to fetch job openings from the backend
  return await getJobOpenings();
}; 
