const marketAbi = require("./NFTPropertyContractSystem");
const rentalAbi = require("./NFTRentalPropertyContractSystem");

const MarketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MarketAddressABI = marketAbi.abi;

const RentalAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const RentalAddressABI = rentalAbi.abi;

module.exports = {
  MarketAddress,
  MarketAddressABI,
  RentalAddress,
  RentalAddressABI
};
