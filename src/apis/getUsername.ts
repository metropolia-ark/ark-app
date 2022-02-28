import axios from 'axios';
import { baseUrl } from '../utils/constants';

interface GetUsernameResponse {
  username: string;
  available: boolean;
}

// Get a username
export const getUsername = (username: string) => {
  return axios.get<GetUsernameResponse>(baseUrl + `/users/username/${username}`);
};
