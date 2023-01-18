/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// import Web3Modal from "web3modal";
// import { ethers } from "ethers";
// import catchAsync from "../../utils/catchAsync";
// import { MarketAddress, MarketAddressABI } from "../../context/constants";

// const fetchContract = signerOrProvider =>
//   new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const createTour = async () => {
  try {
    const name = "Test_name-test";
    const duration = 5;
    const maxGroupSize = 1;
    const difficulty = "easy";
    const price = 100;
    const startDate = ["09-10-2023"];
    const summary = "Exploring the jaw-dropping US east coast by foot and by boat";
    const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et elementum enim. Aliquam at erat posuere, cursus felis in, ultrices erat. Duis tincidunt non ligula non fermentum. Maecenas tincidunt luctus augue ut vehicula. \n Quisque sed purus in erat tincidunt vehicula sit amet ut urna. Nulla facilisi. Suspendisse vehicula luctus dolor, a aliquet augue. Morbi scelerisque tincidunt egestas. Nunc eget lorem rutrum, sodales eros id, dictum risus. Donec malesuada, ex eu sagittis aliquam, sem tortor iaculis nibh, ut porttitor eros risus tempus sem. Vestibulum suscipit in lectus convallis porta."
    console.log(name);

    // await createTokenNFT(price.toString(), name);
    // const tickets = await fetchNFTs();

    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/tours',
      data: {
        _id: "5c88fa8cf4afda39709c2955",
        name,
        duration,
        maxGroupSize,
        difficulty,
        price,
        description,
        startDate,
        startLocation: {
          // GeoJSON
          type: "Point",
          coordinates: [53.342387951181536, -6.286625269623612],
          address: "St. James's Gate, Dublin 8, D08 VF8H",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n Ut eu sem sed justo fringilla rutrum"
        },
        summary
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour created successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const getTour = async (tourId) => {
  try {
  const res = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/v1/tours/${tourId}`
  });

  if(res.data.status === 'success'){
    return res.data.data;
  }
}catch (err) {
  showAlert('error', err.response.data.message);
}
};