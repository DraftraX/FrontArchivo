import axios from 'axios';
import { API_URL } from './ApiRuta';

const tokenItem = axios.create({
  baseURL: API_URL,
});

tokenItem.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default tokenItem;
