/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const forgetPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const userPlaceBid = async (address, user) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/placeBid',
      data: {
        address: address,
        userId: user
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User place bid successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const removeBidding = async (address) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/removeBidding',
      data: {
        address: address
      }
    });

    if (res.data.status === 'success') {
      console.log("Bidding Removed!");
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


