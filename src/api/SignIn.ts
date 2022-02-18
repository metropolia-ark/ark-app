import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REACT_APP_BASE_URL = 'https://media.mw.metropolia.fi/wbma/';

export const signIn = (username: string, password: string) => {
  console.log(username, password);
  axios.post(REACT_APP_BASE_URL + 'login', { username, password })
    .then(response => {
      console.log('response', response.data.token);
    })
    .catch(error => {
      console.log('error', error);
    });
};
