import axios from 'axios';
import { baseUrl } from '../ultis/variables';

// Post media
export const postMedia = (title: string, description: string, file: string, token: string) => {
  axios({
    method: 'post', url: baseUrl + 'media', data: { title: title, description: description, file: file }, headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data',
    },
  });
};
