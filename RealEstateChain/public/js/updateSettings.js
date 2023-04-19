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
      showAlert('success', 'Email sent successfully!');
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

export const addToFavourite = async (slug) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/addFavouriteProperty',
      data: {
        slug
      }
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/property/' + slug);
      }, 1500);
      showAlert('success',"Added to favourite!");
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const removeFromFavourite = async (slug) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/removeFavouriteProperty',
      data: {
        slug
      }
    });
    if (res.data.status === 'success') {
      showAlert('success',"Property has been removed from favourite list");
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
      // window.setTimeout(() => {
      //   location.assign('/property/' + slug);
      // }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirmation, resetToken) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/resetPassword/' + resetToken,
      data: {
        password,
        passwordConfirmation
      }
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
      showAlert("Password has been reset!");
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


