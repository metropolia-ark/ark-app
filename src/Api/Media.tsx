import axios from 'axios';
import { baseUrl } from '../ultis/variables';

export const media = () => {

  axios.get(baseUrl + '/media')
    .then(response => {
      // handle success
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
    // handle error
      console.log(error);
    });
};
