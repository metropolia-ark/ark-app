import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const signUp = (username: string, password: string, email: string) => {
  axios.post(baseUrl + '/users', { username, password, email });
};
