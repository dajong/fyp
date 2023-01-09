/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const searchProperties = async (city, numBedrooms, numBathrooms) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/properties/getProperties',
      data: {
        city,
        numBedrooms,
        numBathrooms
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Registration successfully!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};