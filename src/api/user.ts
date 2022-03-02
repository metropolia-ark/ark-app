import { Method, request } from '../utils/request';
import { User } from '../types';

type GetUserResponse = User;

type GetCurrentUserResponse = { message?: string; user?: User };

type GetUsernameResponse = { username: string; available: boolean }

type SignInResponse = { message: string; token: string; user: User };

type SignUpResponse = { message: string; user_id: number };

// Get a user
export const getUser = (user_id: number) => {
  return request<GetUserResponse>(Method.GET, `/users/${user_id}`);
};

// Get the current user
export const getCurrentUser = async () => {
  const response = await request<User & { message?: string; }>(Method.GET, '/users/user');
  return (response.message ? response : { user: response }) as GetCurrentUserResponse;
};

// Get a username
export const getUsername = (username: string) => {
  return request<GetUsernameResponse>(Method.GET, `/users/username/${username}`);
};

// Authenticate a user
export const signIn = (username: string, password: string) => {
  return request<SignInResponse>(Method.POST, '/login', { username, password });
};

// Create a new user
export const signUp = (username: string, password: string, email: string, full_name?: string) => {
  return request<SignUpResponse>(Method.POST, '/users', { username, password, email, full_name });
};
