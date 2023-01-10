/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { register } from './registration';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { connect } from 'mongoose';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const walletButton = document.getElementById("btn--wallet");
const loginForm = document.querySelector(".form--login");
const registrationForm = document.querySelector(".form--registration");
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');


const connectWallet = async () => {
  if (!window.ethereum) return alert('Please install MetaMask.');

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  setCurrentAccount(accounts[0]);
  window.location.reload();
};

const checkIfWalletIsConnect = async (e) => {
  if (!window.ethereum) return alert("Please install MetaMask.");

  const accounts = await window.ethereum.request({ method: "eth_accounts" });

  if (accounts.length) {
    // setCurrentAccount(accounts[0]);
    console.log("Accounts found: " + accounts);
  } else {
    console.log("No accounts found, connecting wallet now..");
    connectWallet();
    e.target.textContent = "Connected";
    e.target.className += "disabled";
  }
};

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (registrationForm)
  registrationForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirm').value;
    console.log(password);
    console.log(passwordConfirmation);
    register(email, name, "user", password, passwordConfirmation);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

  if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

  if(walletButton)
  walletButton.addEventListener('click', e => {
    console.log("Button clicked!");
    checkIfWalletIsConnect(e);
  });
