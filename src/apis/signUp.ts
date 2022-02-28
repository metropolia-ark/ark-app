import axios from 'axios';
import { baseUrl } from '../utils/constants';

interface SignUpResponse {
  message: string;
  user_id: number;
}

// Create a new user
export const signUp = (username: string, password: string, email: string, full_name?: string) => {
  return axios.post<SignUpResponse>(baseUrl + '/users', { username, password, email, full_name });
};
