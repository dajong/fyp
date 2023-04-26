/* eslint-disable */
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import catchAsync from "../../utils/catchAsync";
import { MarketAddress, MarketAddressABI } from "../../context/constants";

import axios from 'axios';
import { showAlert } from "./alerts";
// import { create as ipfsHttpClient } from 'ipfs-http-client';

const fetchContract = signerOrProvider =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);


  // const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
  
  // const uploadToIPFS = async (buffer) => {
  //   try {
  //     const result = await client.add(buffer);
  //     return result.cid.toString();
  //   } catch (error) {
  //     console.error('Error uploading to IPFS:', error);
  //     throw error;
  //   }
  // };

const createProperty = async (address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, imageCover, description, biddingPrice) => {
    try {
      const formData = new FormData();
      formData.append('address', address);
      formData.append('city', city);
      formData.append('listingNum', listingNum);
      formData.append('propertyStyle', propertyStyle);
      formData.append('garageType', garageType);
      formData.append('garageSize', garageSize);
      formData.append('berRating', berRating);
      formData.append('squareFeet', squareFeet);
      formData.append('lotSize', lotSize);
      formData.append('numBedroom', numBedroom);
      formData.append('numBathroom', numBathroom);
      formData.append('imageCover', imageCover);
      formData.append('description', description);
      formData.append('biddingPrice', biddingPrice);

      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/v1/properties',
        data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Property created successfully!');
        // window.setTimeout(() => {
        //   location.assign('/');
        // }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
      console.log(err);
    }
};

const fetchNFT = async (propertyAddress) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const data = await contract.fetchNFTByPropertyAddress(propertyAddress);
    const item = data.tokenId.toString();
    return item;
  };

// Used to check if user has the NFTs
const fetchUserNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    console.log(accounts[0]);
    const data = await contract.fetchMyNFTs(accounts[0]);
    console.log(data);
  };




export const addContract = catchAsync(async (propertyAddress) =>{
  const contract = await fetchNFT(propertyAddress);
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/properties/addContract",
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

// eslint-disable-next-line import/prefer-default-export
export const createTokenNFT = async (address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, imageCover, description, biddingPrice) => {
  
  // const cid = await uploadToIPFS(imageCover);
  
  // const web3modal = new Web3Modal();
  // const connection = await web3modal.connect();
  // const provider = new ethers.providers.Web3Provider(connection);
  // const signer = provider.getSigner();
  // const bidPrice = ethers.utils.parseUnits(biddingPrice.toString(), "ether");
  // const contract = fetchContract(signer);
  // const url = `https://ipfs.infura.io/ipfs/${cid}`;

  // const transaction = await contract.createTokenNFT(url, address, bidPrice);
  // await transaction.wait();
  await createProperty(address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, imageCover, description, biddingPrice);
  // await addContract(address);
};

export const contractPlaceBid = async (tokenId, biddingPrice) => {
  console.log("running place bid nft..");
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);

  const price = ethers.utils.parseUnits(biddingPrice.toString(), 'ether');
  const transaction = await contract.updateBidPrice(tokenId, price);
  await transaction.wait();
};

export const buyNft = async (tokenId, tokenPrice, isBid) => {
  console.log("running buy nft..");
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);

  const price = ethers.utils.parseUnits(tokenPrice.toString(), 'ether');
  let transaction;
  if(isBid == true){
    console.log('isBid is run..')
    transaction = await contract.buyBidProperty(tokenId, { value: price });
  }else{
    transaction = await contract.createMarketSale(tokenId, { value: price });
  }
   
  await transaction.wait();
};

export const depositPayment = async (tokenId, tokenPrice) => {
  console.log("running deposit nft..");
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);

  const price = ethers.utils.parseUnits(tokenPrice.toString(), 'ether');
  const transaction = await contract.placeDeposit(tokenId, { value: price });
   
  await transaction.wait();
};
