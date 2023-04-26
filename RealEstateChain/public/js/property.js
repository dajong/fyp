/* eslint-disable */
import axios from 'axios';
import catchAsync from "../../utils/catchAsync";
import { showAlert } from './alerts';

export const createProperty = async (address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, imageCover, description, biddingPrice) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/v1/properties',
        data: {
          address,
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
          imageCover,
          description,
          biddingPrice
        }
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

  export const updateProperty = async (address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize,  numBedroom, numBathroom, description, biddingPrice, slug, propertyId) => {
    try {
      const res = await axios({
        method: 'PATCH',
        url: 'http://localhost:3000/api/v1/properties/' + propertyId,
        data: {
          address,
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
          description,
          biddingPrice
        }
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Property updated successfully!');
        window.setTimeout(() => {
          location.assign('/property/' + slug);
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err);
      console.log(err);
    }
  };

export const getProperty = async (propertyId) => {
  try {
  const res = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/v1/properties/${propertyId}`
  });

  if(res.data.status === 'success'){
    return res.data.data;
  }
}catch (err) {
  showAlert('error', err.response.data.message);
}
};

export const soldProperty = catchAsync(async (propertyAddress, slug) =>{
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/properties/soldProperty",
      data: {
        address: propertyAddress,
        slug: slug
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Property Sold!");
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err);
  }
});

export const placeBid = catchAsync(async (propertyAddress, newBidPrice, curBidder) =>{
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/properties/placeBid",
      data: {
        address: propertyAddress,
        biddingPrice: newBidPrice,
        bidder: curBidder
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "New bid is placed");
      setTimeout(() => {
        document.location.reload();
      }, 1500);
    }
  } catch (err) {
    console.log(err)
    showAlert("error", err);
  }
});

export const addView = catchAsync(async (propertyAddress) =>{
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/properties/addView",
      data: {
        address: propertyAddress
      }
    });

    if (res.data.status === "success") {
      console.log("user viewed!")
    }
  } catch (err) {
    showAlert("error", err);
  }
});