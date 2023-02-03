/* eslint-disable */
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import catchAsync from "../../utils/catchAsync";
import { MarketAddress, MarketAddressABI } from "../../context/constants";

import axios from 'axios';
import { showAlert } from "./alerts";

const fetchContract = signerOrProvider =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

const fetchNFTs = async (propertyAddress) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const data = await contract.fetchPropertyAddressNFTs(propertyAddress);
    let contractID;
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, propertyAddress, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      contractID = tokenId.toString();
      console.log(tokenId);
    }));

    return contractID;
  };

export const addContract = catchAsync(async (propertyAddress) =>{
  const contract = await fetchNFTs(propertyAddress);
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
export const createTokenNFT = catchAsync(async (formInputPrice, propertyAddress) => {
  // using hardcoded value for now..
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const price = ethers.utils.parseUnits(formInputPrice, "ether");
  const contract = fetchContract(signer);
  const url =
    "https://gateway.pinata.cloud/ipfs/QmXA7GCd4pWNKXkQ5FGrMMnzMHsRAAzex2WXtWFVdu32ji";

  const transaction = await contract.createTokenNFT(url, price, propertyAddress);
  await transaction.wait();
  await addContract(propertyAddress);
});

export const createPropertyNFT = catchAsync(async (formInputPrice, propertyAddress, url) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const price = ethers.utils.parseUnits(formInputPrice, "ether");
  const contract = fetchContract(signer);

  const transaction = await contract.createTokenNFT(url, price, propertyAddress);
  await transaction.wait();
  await addContract(propertyAddress);
});

export const connectWalletToken = async (account) => {
  console.log("This is run..")
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/connectWalletToken",
      account
    });

    if (res.data.status === "success") {
      showAlert("success", "Wallet connected successfully!");
    }
  } catch (err) {
    showAlert("error", err);
  }
};


export const buyNft = async (tokenId, tokenPrice) => {
  console.log("running buy nft..");
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);

  const price = ethers.utils.parseUnits(tokenPrice.toString(), 'ether');
  const transaction = await contract.createMarketSale(tokenId, { value: price });
  await transaction.wait();
};
