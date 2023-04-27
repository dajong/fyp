/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { register, addNewAdmin } from './registration';
import { updateSettings, forgetPassword, userPlaceBid, removeBidding, resetPassword, addToFavourite, removeFromFavourite } from './updateSettings';
import { createRentalTokenNFT, applyRental, withdrawRental, approveRental, updateRentalProperty,getRentalProperty, signRentalContract, payRent, endRentalContract, renewRentalContract } from './rentalProperty';
import { getProperty, placeBid, updateProperty } from './property';
import { createTokenNFT, buyNft, depositPayment, fetchMyNFTs } from './web3ModalFactory';
import { sendQuery,replyQuery } from './query';
// DOM ELEMENTS
const walletButton = document.getElementById("btn--wallet");
const loginForm = document.querySelector(".form--login");
const registrationForm = document.querySelector(".form--registration");
const registrationAdminForm = document.querySelector(".form--registrationAdmin");
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const buyBiddingBtn = document.getElementById('buy-bid-property');
const depositBiddingBtn = document.getElementById('deposit-bid-property');
const removeBiddingBtn = document.getElementById('remove-bidding-btn');
const createPropertyForm = document.querySelector(".form--createProperty");
const forgetPasswordForm = document.querySelector(".form--forgetPassword");
const biddingForm = document.querySelector(".form--bidding");
const contactAdminForm = document.querySelector(".form--contactAdmin");
const replyQueryForm = document.querySelector(".form--replyQuery");
const resetPasswordForm = document.querySelector(".form--resetPassword");
const addToFavouriteBtn = document.getElementById("add-to-favourite");
const removeFromFavouriteBtn = document.querySelectorAll(".remove-from-favourite");
const testBtn = document.getElementById("btn--test");
const propertyLink = document.getElementById("my-property-link");
const createRentalPropertyForm = document.querySelector(".form--createRentalProperty");
const btnApplyRental = document.getElementById("apply-rental");
const btnWithdrawRentalApplication = document.querySelectorAll(".withdraw-rental-btn");
const btnApproveRentalApplication = document.querySelectorAll(".approve-rental-btn");
const updatePropertyForm = document.getElementById('form--updateProperty');
const updateRentalPropertyForm = document.getElementById('form--updateRentalProperty');
const btnProceedRental = document.querySelectorAll(".proceed-rental-btn");
const btnPayRent = document.querySelectorAll(".pay-rent-btn");
const btnRenewContract = document.querySelectorAll(".renew-contract-btn");
const btnEndContract = document.querySelectorAll(".end-contract-btn");

const connectWallet = async (e) => {
  if (!window.ethereum) return alert('Please install MetaMask.');
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
    createPropertyForm.addEventListener('submit', async e => {
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
    const imageCover = document.getElementById('imageCover').files[0];
    const biddingPrice = document.getElementById('biddingPrice').value;
    const description = document.getElementById('description').value;
    const berRating = document.getElementById('berRating').value;
    const squareFeet = document.getElementById('squareFeet').value;
    const lotSize = document.getElementById('lotSize').value;

    await createTokenNFT(address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, imageCover, description, biddingPrice);

    document.getElementById('address').value = "";
    document.getElementById('listingNum').value = "";
    document.getElementById('garageSize').value = "";
    document.getElementById('numBedroom').value = "";
    document.getElementById('numBathroom').value = "";
    // document.getElementById('price').value = "";
    document.getElementById('squareFeet').value = "";
    document.getElementById('description').value = "";
    document.getElementById('lotSize').value = "";
    document.getElementById('biddingPrice').value = "";
  });

  if(createRentalPropertyForm)
    createRentalPropertyForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("Creating rental property..")

    const address = document.getElementById('address').value;
    const ownerEmail = document.getElementById('ownerEmail').value;
    const city = document.getElementById('city').value;
    const listingNum = document.getElementById('listingNum').value;
    const propertyStyle = document.getElementById('propertyStyle').value;
    const garageType = document.getElementById('garageType').value;
    const garageSize = document.getElementById('garageSize').value;
    const numBedroom = document.getElementById('numBedroom').value;
    const numBathroom = document.getElementById('numBathroom').value;
    const rent = document.getElementById('rent').value;
    const imageCover = document.getElementById('imageCover').files[0];
    const securityDeposit = document.getElementById('securityDeposit').value;
    const description = document.getElementById('description').value;
    const berRating = document.getElementById('berRating').value;
    const squareFeet = document.getElementById('squareFeet').value;
    const lotSize = document.getElementById('lotSize').value;

    await createRentalTokenNFT(address, ownerEmail, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, imageCover, description, securityDeposit);
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

  if (registrationAdminForm)
  registrationAdminForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    addNewAdmin(email, name, password);
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

  if(biddingForm)
    biddingForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("Bidding form is running..")
    const biddingPrice = document.getElementById('biddingAmount').value;
    const curPropertyAddress = document.getElementById('curPropertyAddress').value;
    const curUser = document.getElementById('curUser').value;

    // Can't allow admin to return deposit to customer automatically, will comment out for now.
    const tokenId = BigInt(document.getElementById('curTokenId').value);
    // await contractPlaceBid(tokenId, biddingPrice);
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

  if(buyBiddingBtn)
  buyBiddingBtn.addEventListener('click', async(e) => {
    e.target.textContent = 'Processing...';
    const { propertyId } = e.target.dataset;
    const curProperty = await getProperty(propertyId);
    console.log(curProperty);
    await buyNft(BigInt(curProperty.data.nftContract), curProperty.data.biddingPrice, curProperty.data.address, curProperty.data.slug, curProperty.data._id);
  });

  if(depositBiddingBtn)
  depositBiddingBtn.addEventListener('click', async(e) => {
    e.target.textContent = 'Processing...';
    const { propertyId } = e.target.dataset;
    const curProperty = await getProperty(propertyId);
    console.log(curProperty);
    await depositPayment(BigInt(curProperty.data.nftContract), (curProperty.data.biddingPrice / 100 * 10), curProperty.data.address, curProperty.data.slug, curProperty.data._id);
  });

  if(contactAdminForm)
    contactAdminForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("Sending queries  ..")

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    await sendQuery(email, name, subject, message);
});


if(replyQueryForm)
    replyQueryForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("Sending replies  ..")
    const replyMessage = document.getElementById('replyMessage').value;
    const queryId = document.getElementById('queryId').value;
  
    await replyQuery(replyMessage, queryId);
});

if(resetPasswordForm)
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("resetting password  ..")
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirmation').value;
    const resetToken = document.getElementById('resetToken').value;
  
    await resetPassword(password, passwordConfirmation, resetToken);
});

if(addToFavouriteBtn)
  addToFavouriteBtn.addEventListener('click', async e => {
    console.log("Adding property to favorite");
    const slug = addToFavouriteBtn.dataset.slug;
    console.log(slug);
    await addToFavourite(slug);
  });

  if(removeFromFavouriteBtn){
    removeFromFavouriteBtn.forEach((btn) => {
      btn.addEventListener("click", async e => {
        console.log("Removing property from favorite");
        e.preventDefault();
        const slug = btn.getAttribute("data-slug");
        await removeFromFavourite(slug);
      });
    });
  }

if(testBtn)
  testBtn.addEventListener('click', async e => {
    console.log("test run");
    await fetchMyNFTs();
  });

if(propertyLink)
propertyLink.addEventListener('click', async e => {
  console.log("link clicked");
  e.preventDefault();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const userAddress = accounts[0];
    window.location.href = `/myProperty`;
});

const sections = document.querySelectorAll('.SectionPicker__Section');

sections.forEach(section => {
  section.addEventListener('click', () => {
    sections.forEach(s => s.classList.remove('selected'));
    section.classList.add('selected');
  });
});

const buyTab = document.getElementById("buyTab");
const rentTab = document.getElementById("rentTab");
const rentInput = document.getElementById("rent");

if(buyTab){
  buyTab.addEventListener('click', async e => {
    buyTab.classList.add("selected");
    rentTab.classList.remove("selected");
    rentInput.value = "false";
  });
}

if(rentTab){
  rentTab.addEventListener('click', async e => {
    buyTab.classList.remove("selected");
    rentTab.classList.add("selected");
    rentInput.value = "true";
  });
}

if(btnApplyRental){
  btnApplyRental.addEventListener('click', async e => {
    const slug = btnApplyRental.dataset.slug;
    await applyRental(slug);
  });
}

if(btnWithdrawRentalApplication){
  btnWithdrawRentalApplication.forEach((btn) => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const slug = btn.getAttribute("data-slug");
      await withdrawRental(slug);
    });
  });
}

if(btnApproveRentalApplication){
  btnApproveRentalApplication.forEach((btn) => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const userId = btn.getAttribute("data-userid");
      const propertySlug = btn.getAttribute("data-slug");
      await approveRental(propertySlug, userId);
    });
  });
}

if(updatePropertyForm)
updatePropertyForm.addEventListener('submit', async e => {
  e.preventDefault();
  console.log("updating property..")

  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const listingNum = document.getElementById('listingNum').value;
  const propertyStyle = document.getElementById('propertyStyle').value;
  const garageType = document.getElementById('garageType').value;
  const garageSize = document.getElementById('garageSize').value;
  const numBedroom = document.getElementById('numBedroom').value;
  const numBathroom = document.getElementById('numBathroom').value;
  const biddingPrice = document.getElementById('biddingPrice').value;
  const description = document.getElementById('description').value;
  const berRating = document.getElementById('berRating').value;
  const squareFeet = document.getElementById('squareFeet').value;
  const lotSize = document.getElementById('lotSize').value;
  const slug = document.getElementById('slug').value;
  const propertyId = document.getElementById('propertyId').value;

  await updateProperty(address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, description, biddingPrice, slug,propertyId);
});

if (updateRentalPropertyForm) {
  updateRentalPropertyForm.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("updating rental property...");

    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const listingNum = document.getElementById('listingNum').value;
    const propertyStyle = document.getElementById('propertyStyle').value;
    const garageType = document.getElementById('garageType').value;
    const garageSize = document.getElementById('garageSize').value;
    const numBedroom = document.getElementById('numBedroom').value;
    const numBathroom = document.getElementById('numBathroom').value;
    const rent = document.getElementById('rent').value;
    const securityDeposit = document.getElementById('securityDeposit').value;
    const description = document.getElementById('description').value;
    const berRating = document.getElementById('berRating').value;
    const squareFeet = document.getElementById('squareFeet').value;
    const lotSize = document.getElementById('lotSize').value;
    const ownerEmail = document.getElementById('ownerEmail').value;
    //const archive = document.getElementById('archive').checked;
    const slug = document.getElementById('slug').value;
    const rentalPropertyId = document.getElementById('rentalPropertyId').value;
    console.log(rentalPropertyId)
    await updateRentalProperty(address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, securityDeposit, description, ownerEmail, slug, rentalPropertyId);
  });
}

if(btnProceedRental){
  btnProceedRental.forEach((btn) => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const propertyId = btn.getAttribute("data-propertyid");
      const curProperty = await getRentalProperty(propertyId);
      console.log(curProperty);
      console.log(curProperty.data._id);

      await signRentalContract(BigInt(curProperty.data.nftContract), curProperty.data.rent + curProperty.data.securityDeposit, propertyId);
    });
  });
}

if(btnPayRent){
  btnPayRent.forEach((btn) => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const propertyId = btn.getAttribute("data-propertyid");
      const rent = btn.getAttribute("data-rent");
      const tokenId = btn.getAttribute("data-tokenId");

      await payRent(propertyId, rent, BigInt(tokenId));
    });
  });
}

if(btnEndContract){
  btnEndContract.forEach((btn) => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const propertyId = btn.getAttribute("data-propertyid");
      const tokenId = btn.getAttribute("data-tokenId");

      await endRentalContract(propertyId, BigInt(tokenId));
    });
  });
}

if(btnRenewContract){
  btnRenewContract.forEach((btn) => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const propertyId = btn.getAttribute("data-propertyid");
      const tokenId = btn.getAttribute("data-tokenId");

      await renewRentalContract(propertyId, BigInt(tokenId));
    });
  });
}






  
