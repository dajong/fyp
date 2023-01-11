import Web3Modal from "web3modal";
import { ethers } from "ethers";
import catchAsync from "../../utils/catchAsync";
import { MarketAddress, MarketAddressABI } from "../../context/constants";

const fetchContract = signerOrProvider =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

// eslint-disable-next-line import/prefer-default-export
export const createTokenNFT = catchAsync(async formInputPrice => {
  // using hardcoded value for now..
  console.log("Run_ 0..");
  const web3modal = new Web3Modal();
  console.log("Run_ 1..");
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  //   connection != null
  //     ? new ethers.providers.Web3Provider(connection)
  //     : ethers.providers.getDefaultProvider();
  console.log("Run 3..");
  const signer = provider.getSigner();
  console.log("Run 4..");
  const price = ethers.utils.parseUnits(formInputPrice, "ether");
  const contract = fetchContract(signer);
  const listingPrice = await contract.getListingPrice();
  const url =
    "https://gateway.pinata.cloud/ipfs/QmXA7GCd4pWNKXkQ5FGrMMnzMHsRAAzex2WXtWFVdu32ji";

  const transaction = await contract.createTokenNFT(url, price, {
    value: listingPrice.toString()
  });
  await transaction.wait();
});
