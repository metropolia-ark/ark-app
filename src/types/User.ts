export interface User {
  user_id: number;
  username: string;
  email: string;
  time_created: string;
  full_name: string | null;
  is_admin: boolean | null;
}
