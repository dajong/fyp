/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { register } from './registration';
import { updateSettings, forgetPassword } from './updateSettings';
// import { bookTour } from './stripe';
import { createTour, getTour } from './tour';
import { createTokenNFT, connectWalletToken, buyNft } from './web3ModalFactory';
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const walletButton = document.getElementById("btn--wallet");
const loginForm = document.querySelector(".form--login");
const registrationForm = document.querySelector(".form--registration");
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const createTourForm = document.querySelector(".form--createTour");
const forgetPasswordForm = document.querySelector(".form--forgetPassword");


const connectWallet = async (e) => {
  if (!window.ethereum) return alert('Please install MetaMask.');

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  await connectWalletToken(accounts[0]);

  // window.location.reload();
};

const checkIfWalletIsConnect = async (e) => {
  if (!window.ethereum) return alert("Please install MetaMask.");

  const accounts = await window.ethereum.request({ method: "eth_accounts" });

  if (accounts.length) {
    // setCurrentAccount(accounts[0]);
    console.log("Accounts found: " + accounts);
  } else {
    console.log("No accounts found, connecting wallet now..");
    connectWallet(e);
  }
};

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if(forgetPasswordForm)
forgetPasswordForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  forgetPassword(email);
});

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

  if (createTourForm)
  createTourForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log("Creating tour..")
    const name = "Test_name-test";
    const price = "100";
    createTour();
    createTokenNFT(price, name);
  });

if (registrationForm)
  registrationForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirm').value;
    register(email, name, "user", password, passwordConfirmation);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
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
  bookBtn.addEventListener('click',async e => {
    console.log("button_click")
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    const curTour = await getTour(tourId);
    console.log(curTour);
    await buyNft(BigInt(curTour.data.ticket[0]), curTour.data.price);
  });

  if(walletButton)
  walletButton.addEventListener('click', e => {
    console.log("Button clicked!");
    checkIfWalletIsConnect(e);
  });
