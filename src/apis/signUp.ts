import { Method, request } from './request';

interface SignUpResponse {
  message: string;
  user_id: number;
}

// Create a new user
export const signUp = (username: string, password: string, email: string, full_name?: string) => {
  return request<SignUpResponse>(Method.POST, '/users', { username, password, email, full_name });
};
