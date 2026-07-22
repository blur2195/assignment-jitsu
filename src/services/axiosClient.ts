import axios from "axios";
import { mockAxiosAdapter } from "mock/axiosAdapter";

export const axiosClient = axios.create({
  adapter: mockAxiosAdapter,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  // await new Promise(resolve => setTimeout(resolve, 1500));
  return config;
});

export default axiosClient;
