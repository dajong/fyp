// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFTRentalPropertyContractSystem is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct Property {
        uint256 id;
        address owner;
        uint256 rent;
        uint256 securityDeposit;
        bool isRented;
        address renter;
        uint256 lastPaidDate;
        string propertyAddress;
        uint256 contractExpiration;
    }

    mapping(uint256 => Property) public properties;

    constructor() ERC721("RentalProperties", "RPR") {}

    function addProperty(string memory tokenURI, uint256 rent, uint256 securityDeposit, string memory propertyAddress) public payable returns (uint) {
        _tokenIdCounter++;

        properties[_tokenIdCounter] = Property(
            _tokenIdCounter,
            msg.sender,
            rent,
            securityDeposit,
            false,
            address(0),
            0,
            propertyAddress,
            0
        );
        _safeMint(msg.sender, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, tokenURI);
        return _tokenIdCounter; 
    }

    function compareStrings(string memory a, string memory b) public view returns (bool) {
      return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function updateRentalProperty(
        uint256 propertyId,
        uint256 newRent,
        uint256 newSecurityDeposit
    ) public {
        // Require that the sender is the owner of the property
        require(
            msg.sender == properties[propertyId].owner,
            "Only the owner can update the property"
        );

        // Update rent and security deposit
        properties[propertyId].rent = newRent;
        properties[propertyId].securityDeposit = newSecurityDeposit;
    }

    function rentProperty(uint256 propertyId) public payable {
        Property storage property = properties[propertyId];

        require(!property.isRented, "Property already rented");
        require(msg.value == (property.securityDeposit + property.rent), "Incorrect security deposit");

        property.isRented = true;
        property.renter = msg.sender;
        property.lastPaidDate = block.timestamp;
        property.contractExpiration = block.timestamp + 365 days;
        payable(property.owner).transfer(msg.value);
    }

    function payRent(uint256 propertyId) public payable {
        Property storage property = properties[propertyId];

        require(property.isRented, "Property not rented");
        require(property.renter == msg.sender, "Only the renter can pay rent");
        require(msg.value == property.rent, "Incorrect rent amount");
        require(block.timestamp >= property.lastPaidDate + 30 days, "Rent already paid for the current period");

        property.lastPaidDate = property.lastPaidDate + 30 days;
        payable(property.owner).transfer(msg.value);
    }

    function endRental(uint256 propertyId) public {
        Property storage property = properties[propertyId];

        property.isRented = false;
        property.renter = address(0);
    }

    function renewContract(uint256 propertyId) public {
        Property storage property = properties[propertyId];

        require(property.renter == msg.sender, "Only the renter can renew the contract");
        require(block.timestamp >= property.contractExpiration, "Contract has not expired yet");

        property.contractExpiration = block.timestamp + 365 days;
    }

    function withdrawSecurityDeposit(uint256 propertyId) public {
        Property storage property = properties[propertyId];

        require(property.owner == msg.sender, "Only the owner can withdraw the security deposit");
        require(!property.isRented, "Property is still rented");

        uint256 deposit = property.securityDeposit;
        property.securityDeposit = 0;
        payable(msg.sender).transfer(deposit);
    }

    function fetchNFTByPropertyAddress(string memory propertyAddress) public view returns (Property memory) {
      uint totalItemCount = _tokenIdCounter;

      Property memory item;
      for (uint i = 0; i < totalItemCount; i++) {
        if (compareStrings(properties[i + 1].propertyAddress, propertyAddress)) {
          uint currentId = i + 1;
          Property storage currentItem = properties[currentId];
          item = currentItem;
        }
      }
      return item;
    }

    function fetchNFTById(uint tokenId) public view returns (Property memory) {
      Property memory item = properties[tokenId];
      return item;
    }
}