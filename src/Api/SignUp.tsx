import axios from 'axios';
import { baseUrl } from '../ultis/variables';

export const signUp = (username: string, password: string, email: string, full_name?: string) => {
  console.log(username, password, email, baseUrl, full_name);
  axios.post(baseUrl + '/users', { username, password, email, full_name })
    .then(response => {
      console.log('response', response.data);

    })
    .catch(error => {
      console.log('error', error);
    });

};
