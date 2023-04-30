/* eslint-disable */
import axios from 'axios';
import catchAsync from "../../utils/catchAsync";
import { showAlert } from './alerts';
/* eslint-disable */
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { RentalAddress, RentalAddressABI } from "../../context/constants";
import { uploadToIPFS } from './ipfsUtils';

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

export const getRentalProperty = async (propertyId) => {
  try {
  const res = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/v1/rentals/${propertyId}`
  });

  if(res.data.status === 'success'){
    return res.data.data;
  }
}catch (err) {
  showAlert('error', err.response.data.message);
}
};

const createRentalProperty = async (address, ownerEmail, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, imageCover, description, securityDeposit) => {
  try {
    const formData = new FormData();
    formData.append('address', address);
    formData.append('ownerEmail', ownerEmail);
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
    formData.append('rent', rent);
    formData.append('imageCover', imageCover);
    formData.append('description', description);
    formData.append('securityDeposit', securityDeposit);

    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/rentals/createRentalProperty',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Rental Property created successfully!');
      // window.setTimeout(() => {
      //     location.assign('/');
      //   }, 1500);
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
          location.assign('/rentalApplications');
        }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
});

export const approveRental = catchAsync(async (slug, userid) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/rentals/approveRental',
      data: {
        slug: slug,
        userId: userid
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Application approved');
      window.setTimeout(() => {
          location.assign('/property/rent/' + slug);
        }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
});

const rentProperty = catchAsync(async (propertyId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/rentals/rentProperty',
      data: {
        propertyId: propertyId
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Contract signed successfully');
      window.setTimeout(() => {
        location.assign('/myRentalProperties');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
});

export const withdrawRental = catchAsync(async (slug) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/rentals/withdrawApplication',
      data: {
        slug
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Withdraw application successfully');
      window.setTimeout(() => {
          location.assign('/rentalApplications');
        }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
});

const payRentMongo = catchAsync(async (propertyId) =>{
  try {
      const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/rentals/payRent",
      data: {
          propertyId: propertyId
      }
      });

      if (res.data.status === "success") {
        showAlert("success", "Rent Paid");
      }
  } catch (err) {
      showAlert("error", err);
  }
});

const endContractMongo = catchAsync(async (propertyId) =>{
  try {
      const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/rentals/endRentalContract",
      data: {
          propertyId: propertyId
      }
      });

      if (res.data.status === "success") {
        showAlert("success", "Contract Terminated");
      }
  } catch (err) {
      showAlert("error", err);
  }
});

const renewContractMongo = catchAsync(async (propertyId) =>{
  try {
      const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/rentals/renewRentalContract",
      data: {
          propertyId: propertyId
      }
      });

      if (res.data.status === "success") {
        showAlert("success", "Contract Renewed");
      }
  } catch (err) {
      showAlert("error", err);
  }
});

export const payRent = catchAsync(async (propertyId, rent, tokenId) => {
  console.log("pay rent");
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(RentalAddress, RentalAddressABI, signer);

  const price = ethers.utils.parseUnits(rent.toString(), 'ether');
  const transaction = await contract.payRent(tokenId, { value: price });
  await transaction.wait();
  await payRentMongo(propertyId);
});

export const endRentalContract = catchAsync(async (propertyId, tokenId) => {
  console.log("end contract");
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(RentalAddress, RentalAddressABI, signer);
  const transaction = await contract.endRental(tokenId);
  await transaction.wait();
  await endContractMongo(propertyId);
});

export const renewRentalContract = catchAsync(async (propertyId, tokenId) => {
  console.log("renew contract");
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(RentalAddress, RentalAddressABI, signer);
  const transaction = await contract.renewContract(tokenId);
  await transaction.wait();
  await renewContractMongo(propertyId);
});

  // eslint-disable-next-line import/prefer-def\ault-export
export const createRentalTokenNFT = async (address, ownerEmail, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, imageCover, description, securityDeposit) => {
    // using hardcoded value for now..
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const price = ethers.utils.parseUnits(rent, "ether");
    const deposit = ethers.utils.parseUnits(securityDeposit, "ether");
    const contract = fetchContract(signer);
    const url = await uploadToIPFS(imageCover);
  
    const transaction = await contract.addProperty(url, price, deposit, address);
    await transaction.wait();
    await createRentalProperty(address, ownerEmail, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, imageCover, description, securityDeposit);
    await addContract(address);
  };

  export const signRentalContract = async (tokenId, tokenPrice, propertyId) => {
    console.log("running rental contract");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(RentalAddress, RentalAddressABI, signer);
  
    const price = ethers.utils.parseUnits(tokenPrice.toString(), 'ether');
    const transaction = await contract.rentProperty(tokenId, { value: price });
     
    await transaction.wait();
    await rentProperty(propertyId);
  };

  export const updateRentalProperty = async (address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, securityDeposit, description, ownerEmail, slug, rentalPropertyId, tokenId) => {
    console.log("updating rental property");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(RentalAddress, RentalAddressABI, signer);
    const transaction = await contract.updateRentalProperty(tokenId, rent, securityDeposit);
    await transaction.wait();
    await updateRentalPropertyMongo(address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, securityDeposit, description, ownerEmail, slug, rentalPropertyId);
  };

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

const updateRentalPropertyMongo = async (address, city, listingNum, propertyStyle, garageType, garageSize, berRating, squareFeet, lotSize, numBedroom, numBathroom, rent, securityDeposit, description, ownerEmail, slug, rentalPropertyId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/rentals/updateRentalProperty/' + rentalPropertyId,
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
        rent,
        securityDeposit,
        description,
        ownerEmail
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Rental property updated successfully!');
      window.setTimeout(() => {
        location.assign('/property/rent/' + slug);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
    console.log(err);
  }
};