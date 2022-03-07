import { Method, request } from '../utils';
import { Media } from '../types';

// Response type definitions
type GetMediaResponse = Media;
type GetMediasResponse = Media[];
type AddTagToMediaResposne = { message: string; tag_id: number };
type UploadMediaResponse = { message: string; file_id: number };
type DeleteMediaResponse = { message: string; };

// Get a media
export const getMedia = (file_id: number) => {
  return request<GetMediaResponse>(Method.GET, `/media/${file_id}`);
};

// Get a list of medias by tag
export const getMediasByTag = (tag: string) => {
  return request<GetMediasResponse>(Method.GET, `/tags/${tag}`);
};

// Add a tag to a media
export const addTagToMedia = (file_id: number, tag: string) => {
  return request<AddTagToMediaResposne>(Method.POST, '/tags', { file_id, tag });
};

// Upload a new media
export const uploadMedia = (data: FormData) => {
  return request<UploadMediaResponse>(Method.POST, '/media', data, { 'Content-Type': 'multipart/form-data' });
};

// Delete a media
export const deleteMedia = (file_id: number) => {
  return request<DeleteMediaResponse>(Method.DELETE, `/media/${file_id}`);
};
