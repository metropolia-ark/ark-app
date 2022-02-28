import { Method, request } from './request';
import { User } from '../types';

interface SignInResponse {
  message: string;
  token: string;
  user: User;
}

// Authenticate a user
export const signIn = (username: string, password: string) => {
  return request<SignInResponse>(Method.POST, '/login', { username, password });
};
