/* eslint-disable */
import axios from 'axios';
import catchAsync from "../../utils/catchAsync";
import { showAlert } from './alerts';
/* eslint-disable */
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { RentalAddress, RentalAddressABI } from "../../context/constants";

const fetchContract = signerOrProvider =>
  new ethers.Contract(RentalAddress, RentalAddressABI, signerOrProvider);

const fetchNFT = async (propertyAddress) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const data = await contract.fetchNFTByPropertyAddress(propertyAddress);
    console.log(data.id);
    const item = data.id.toString();
    return item;
};

export const createRentalProperty = async (address, ownerEmail, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, rent, imageCover, description, securityDeposit) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/v1/rentals/createRentalProperty',
        data: {
          address,
          ownerEmail,
          city,
          listingNum,
          propertyStyle,
          garageType,
          garageSize,
          berRating,
          squareFeet,
          lotSize,
          numBedroom,
          numBathroom,
          rent,
          imageCover,
          description,
          securityDeposit
        }
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Rental Property created successfully!');
        window.setTimeout(() => {
            location.assign('/');
          }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
      console.log(err);
    }
  };

export const applyRental = catchAsync(async (slug) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/rentals/applyForRental',
      data: {
        slug
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Application sent successfully');
      window.setTimeout(() => {
          location.assign('/');
        }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
});

  // eslint-disable-next-line import/prefer-def\ault-export
export const createRentalTokenNFT = catchAsync(async (rentPrice, propertyAddress, securityDeposit) => {
    // using hardcoded value for now..
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const price = ethers.utils.parseUnits(rentPrice, "ether");
    const deposit = ethers.utils.parseUnits(securityDeposit, "ether");
    const contract = fetchContract(signer);
    const url =
      "https://gateway.pinata.cloud/ipfs/QmXA7GCd4pWNKXkQ5FGrMMnzMHsRAAzex2WXtWFVdu32ji";
  
    const transaction = await contract.addProperty(url, price, deposit, propertyAddress);
    await transaction.wait();
    await addContract(propertyAddress, transaction);
  });

const addContract = catchAsync(async (propertyAddress, tx) =>{
    const contract = await fetchNFT(propertyAddress);
    try {
        const res = await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/rentals/addContract",
        data: {
            address: propertyAddress,
            nftContract: contract
        }
        });

        if (res.data.status === "success") {
        showAlert("success", "Contract added successfully!");
        }
    } catch (err) {
        showAlert("error", err);
    }
});