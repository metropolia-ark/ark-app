import axios from 'axios';

const REACT_APP_BASE_URL = 'https://media.mw.metropolia.fi/wbma/';

export const signIn = (username: string, password: string) => {
  console.log(username, password);
  axios.post(REACT_APP_BASE_URL + 'login', { username, password })
    .then(response => {
      console.log('response', response.data);
    })
    .catch(error => {
      console.log('error', error);
    });
};
