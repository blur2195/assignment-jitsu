import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

axiosClient.interceptors.request.use(async (config) => {
  // await new Promise(resolve => setTimeout(resolve, 1500));
  return config;
});

export default axiosClient;