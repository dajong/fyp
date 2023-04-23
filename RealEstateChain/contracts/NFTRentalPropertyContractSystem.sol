// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RentalProperties is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct Property {
        uint256 id;
        address owner;
        uint256 rent;
        uint256 securityDeposit;
        bool isRented;
        address renter;
        uint256 lastPaidDate;
    }

    mapping(uint256 => Property) public properties;

    constructor() ERC721("RentalProperties", "RPR") {}

    function addProperty(uint256 rent, uint256 securityDeposit) public onlyOwner {
        _tokenIdCounter++;

        properties[_tokenIdCounter] = Property(
            _tokenIdCounter,
            msg.sender,
            rent,
            securityDeposit,
            false,
            address(0),
            0
        );
        _safeMint(msg.sender, _tokenIdCounter);
    }

    function rentProperty(uint256 propertyId) public payable {
        Property storage property = properties[propertyId];

        require(!property.isRented, "Property already rented");
        require(msg.value == property.securityDeposit, "Incorrect security deposit");

        property.isRented = true;
        property.renter = msg.sender;
        property.lastPaidDate = block.timestamp;
    }

    function payRent(uint256 propertyId) public payable {
        Property storage property = properties[propertyId];

        require(property.isRented, "Property not rented");
        require(property.renter == msg.sender, "Only the renter can pay rent");
        require(msg.value == property.rent, "Incorrect rent amount");
        require(block.timestamp >= property.lastPaidDate + 30 days, "Rent already paid for the current period");

        property.lastPaidDate = block.timestamp;
        payable(property.owner).transfer(msg.value);
    }

    function endRental(uint256 propertyId) public {
        Property storage property = properties[propertyId];

        require(property.renter == msg.sender, "Only the renter can end the rental");

        property.isRented = false;
        property.renter = address(0);
    }

    function withdrawSecurityDeposit(uint256 propertyId) public {
        Property storage property = properties[propertyId];

        require(property.owner == msg.sender, "Only the owner can withdraw the security deposit");
        require(!property.isRented, "Property is still rented");

        uint256 deposit = property.securityDeposit;
        property.securityDeposit = 0;
        payable(msg.sender).transfer(deposit);
    }
}