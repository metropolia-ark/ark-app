import axios from 'axios';
import { baseUrl } from '../ultis/variables';

export const signUp = (username: string, password: string, email: string, full_name?: string) => {

  // Post the user data to the api
  axios.post(baseUrl + '/users', { username, password, email, full_name })
    .then(response => {
      console.log('response', response.data);
    })
    .catch(error => {
      console.log('error', error);
    });
};
