import { Method, request } from './request';
import { User } from '../types';

interface GetCurrentUserResponse {
  message?: string;
  user?: User;
}

// Get the current user's data
export const getCurrentUser = async () => {
  const response = await request<User & { message?: string; }>(Method.GET, '/users/user');
  return (response.message ? response : { user: response }) as GetCurrentUserResponse;
};
