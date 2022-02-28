import { Method, request } from '../utils/request';

interface GetUsernameResponse {
  username: string;
  available: boolean;
}

// Get a username
export const getUsername = (username: string) => {
  return request<GetUsernameResponse>(Method.GET, `/users/username/${username}`);
};
