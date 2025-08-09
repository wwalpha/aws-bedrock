import axios from 'axios';

export const apiClient = () => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
  });

  return client;
};
