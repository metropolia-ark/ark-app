import { Method, request } from '../utils/request';

interface PostResponse{
  message: string;
  user_id: number;
}
// PostMedia api
export const postMedia2 = (token: string | null, formData: FormData) => {
  return request<PostResponse>(Method.POST, '/media', { formData });
};
