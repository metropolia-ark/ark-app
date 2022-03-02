import { Method, request } from '../utils/request';

interface TagResponse {
  message: string;
  tag_id: number;
}

// Create a new user
export const postTag = (file_id:number, tag:string, token:string|null) => {
  return request<TagResponse>(Method.POST, '/tags', { file_id, tag }, { 'x-access-token': token as string });
};
