import axios from 'axios';
import { baseUrl } from '../utils/constants';
import { User } from '../types';

interface SignInResponse {
  message: string;
  token: string;
  user: User;
}

// Authenticate a user
export const signIn = (username: string, password: string) => {
  return axios.post<SignInResponse>(baseUrl + '/login', { username, password });
};
