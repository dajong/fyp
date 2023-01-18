/* eslint-disable */
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import catchAsync from "../../utils/catchAsync";
import { MarketAddress, MarketAddressABI } from "../../context/constants";

import axios from 'axios';
import { showAlert } from "./alerts";

const fetchContract = signerOrProvider =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

const fetchNFTs = async (tourName) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const data = await contract.fetchTourNFTs(tourName);
    const IDs = [];
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, tourName, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      IDs.push(tokenId.toString());
      console.log(tokenId);
      console.log(tourName);
    }));

    return IDs;
  };

export const addTickets = catchAsync(async (tourName) =>{
  const tickets = await fetchNFTs(tourName);
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/tours/addTickets",
      data: {
        name: tourName,
        ticket: tickets
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Ticket added successfully!");
    }
  } catch (err) {
    showAlert("error", err);
  }
});

// eslint-disable-next-line import/prefer-default-export
export const createTokenNFT = catchAsync(async (formInputPrice, tourName) => {
  // using hardcoded value for now..
  console.log("Run_ 0..");
  const web3modal = new Web3Modal();
  console.log("Run_ 1..");
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  console.log("Run 3..");
  const signer = provider.getSigner();
  console.log("Run 4..");
  const price = ethers.utils.parseUnits(formInputPrice, "ether");
  const contract = fetchContract(signer);
  const url =
    "https://gateway.pinata.cloud/ipfs/QmXA7GCd4pWNKXkQ5FGrMMnzMHsRAAzex2WXtWFVdu32ji";

  const transaction = await contract.createTokenNFT(url, price, tourName);
  await transaction.wait();
  await addTickets(tourName);
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
