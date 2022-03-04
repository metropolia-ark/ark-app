import { Method, request } from '../utils/request';

interface SettingUpdate {
  message: string;
  user_id: number;
}

// Update user data
export const updateUser = (username: string, password: string, email: string) => {
  return request<SettingUpdate>(Method.PUT, '/users', { username, password, email });
};
