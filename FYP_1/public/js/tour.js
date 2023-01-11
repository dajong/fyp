/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createTour = async () => {
  try {
    const name = "The Sea Explorer";
    const duration = 5;
    const maxGroupSize = 1;
    const difficulty = "easy";
    const price = 100;
    const startDate = ["09-10-2023"];
    const summary = "Exploring the jaw-dropping US east coast by foot and by boat";
    console.log(name);
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/tours',
      data: {
        name,
        duration,
        maxGroupSize,
        difficulty,
        price,
        startDate,
        summary
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};