/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { register } from './registration';
import { updateSettings, forgetPassword, userPlaceBid, removeBidding } from './updateSettings';
import { createProperty, getProperty, soldProperty, placeBid } from './property';
import { createTokenNFT, connectWalletToken, buyNft } from './web3ModalFactory';
// DOM ELEMENTS
const walletButton = document.getElementById("btn--wallet");
const loginForm = document.querySelector(".form--login");
const registrationForm = document.querySelector(".form--registration");
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const checkoutBiddingBtn = document.getElementById('checkout-bidding-btn');
const buyBtn = document.getElementById('buy-property');
const removeBiddingBtn = document.getElementById('remove-bidding-btn');
const createPropertyForm = document.querySelector(".form--createProperty");
const forgetPasswordForm = document.querySelector(".form--forgetPassword");
const biddingForm = document.querySelector(".form--bidding");

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

  if(createPropertyForm)
    createPropertyForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log("Creating property..")

    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const listingNum = document.getElementById('listingNum').value;
    const propertyStyle = document.getElementById('propertyStyle').value;
    const garageType = document.getElementById('garageType').value;
    const garageSize = document.getElementById('garageSize').value;
    const numBedroom = document.getElementById('numBedroom').value;
    const numBathroom = document.getElementById('numBathroom').value;
    const price = document.getElementById('price').value;
    const imageCover = document.getElementById('imageCover').files[0];
    const biddingPrice = document.getElementById('biddingPrice').value;
    const description = document.getElementById('description').value;
    const berRating = document.getElementById('berRating').value;
    const squareFeet = document.getElementById('squareFeet').value;
    const lotSize = document.getElementById('lotSize').value;

    createProperty(address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, price, imageCover, description, biddingPrice);
    // createTokenNFT(price, address);

    document.getElementById('address').value = "";
    document.getElementById('listingNum').value = "";
    document.getElementById('garageSize').value = "";
    document.getElementById('numBedroom').value = "";
    document.getElementById('numBathroom').value = "";
    document.getElementById('price').value = "";
    document.getElementById('imageCover').value = "";
    document.getElementById('squareFeet').value = "";
    document.getElementById('description').value = "";
    document.getElementById('lotSize').value = "";
    document.getElementById('biddingPrice').value = "";
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

  if(buyBtn)
  buyBtn.addEventListener('click',async e => {
    console.log("button_click")
    e.target.textContent = 'Processing...';
    const { propertyId } = e.target.dataset;
    const curProperty = await getProperty(propertyId);
    console.log(curProperty);
    await buyNft(BigInt(curProperty.data.nftContract), curProperty.data.price);
    await soldProperty(curProperty.data.address);
  });

  if(checkoutBiddingBtn)
  checkoutBiddingBtn.addEventListener('click',async e => {
    console.log("button_click")
    e.target.textContent = 'Processing...';
    const propertyId = e.target.value;
    console.log(propertyId);
    const curProperty = await getProperty(propertyId);
    console.log(curProperty);
    // await buyNft(BigInt(curProperty.data.nftContract), curProperty.data.biddingPrice);
    // await soldProperty(curProperty.data.address);
  });

  if(biddingForm)
    biddingForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("Bidding form is running..")
    const biddingPrice = document.getElementById('biddingAmount').value;
    const curPropertyAddress = document.getElementById('curPropertyAddress').value;
    const curUser = document.getElementById('curUser').value;
    await placeBid(curPropertyAddress, biddingPrice, curUser);
    await userPlaceBid(curPropertyAddress, curUser);
    document.getElementById('biddingAmount').textContent = '';
  });

  if(removeBiddingBtn)
    removeBiddingBtn.addEventListener('click', async e => {
      console.log("Button clicked!");
      const address = e.target.value;
      console.log(address);
      await removeBidding(address);
  });  

  if(walletButton)
  walletButton.addEventListener('click', e => {
    console.log("Button clicked!");
    checkIfWalletIsConnect(e);
  });
