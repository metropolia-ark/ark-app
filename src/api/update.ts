import { Method, request } from '../utils/request';

interface SettingUpdate {
  message: string;
  user_id: number;
}

// Update user data
export const updateUser = (username: string, password: string, email: string, full_name?: string) => {
  return request<SettingUpdate>(Method.POST, '/users', { username, password, email, full_name });
};
