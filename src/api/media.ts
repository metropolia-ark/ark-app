import { Method, request } from '../utils/request';
import { baseUrl } from '../utils/constants';
import { Media } from '../types';

// Response type definitions
type GetMediasResponse = Media[];
type AddTagToMediaResposne = { message: string; tag_id: number };

// Get a list of medias by tag
export const getMediasByTag = (tag: string) => {
  return request<GetMediasResponse>(Method.GET, `/tags/${tag}`);
};

// Add a tag to a media
export const addTagToMedia = (file_id: number, tag: string) => {
  return request<AddTagToMediaResposne>(Method.POST, '/tags', { file_id, tag });
};

// Upload new media
export const postMedia = async (formData: FormData, token: string | null) => {
  if (!token) return;
  const options = {
    method: 'POST',
    headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  };
  const response = await fetch(baseUrl + '/media', options);
  return await response.json();
};
