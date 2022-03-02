import { Method, request } from '../utils/request';

interface GetAvatarResponse {
  'file_id': number,
  'tag': string,
  'filename': string,
  'filesize':number,
  'title': string,
  'description': string,
  'user_id': number,
  'media_type': string,
  'mime_type': string,
  'time_added': string
}
// Get the current users avatar
export const getTagAvatar = async (avatar:string) => {
  return request<GetAvatarResponse[]>(Method.GET, `/tags/${avatar}`);
};
