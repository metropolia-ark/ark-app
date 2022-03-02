import { Method, request } from '../utils/request';
import { Media } from '../types';

// Response type definitions
type GetMediasResponse = Media[];

// Get a list of medias
export const getMedias = (tag: string) => {
  return request<GetMediasResponse>(Method.GET, `/tags/${tag}`);
};
