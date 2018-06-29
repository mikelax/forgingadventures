import axios from 'axios/index';
import { getAccessToken } from './login';

// setup Axios instance configured for API access with Authorization header

export const axiosApi = axios.create();

axiosApi.defaults.baseURL = '/api';
axiosApi.interceptors.request.use((config) => {
  const tokenString = getAccessToken();

  if (tokenString) {
    config.headers['Authorization'] = 'Bearer ' + tokenString;
  }

  return config;
});
