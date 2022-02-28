import axios from 'axios';
import { baseUrl } from '../ultis/variables';

// Post the user data to the api
export const signUp = (username: string, password: string, email: string, full_name?: string) => {
  axios.post(baseUrl + '/users', { username, password, email, full_name })
    .catch(error => {
      console.log('error', error);
    });
};
