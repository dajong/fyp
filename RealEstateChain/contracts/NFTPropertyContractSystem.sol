// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTPropertyContractSystem is ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      string propertyAddress;
      uint256 bidPrice;
      uint256 price;
      uint256 paidAmount;
      address payable currentBidder;
      bool sold;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      string propertyAddress,
      uint256 bidPrice,
      uint256 price,
      uint256 paidAmount,
      address payable currentBidder,
      bool sold
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
      owner = payable(msg.sender);
    }

    function concatenate(string memory a,string memory b) public pure returns (string memory){
        return string(abi.encodePacked(a,' ',b));
    } 

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    function compareStrings(string memory a, string memory b) public view returns (bool) {
      return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    /* Mints a token and lists it in the marketplace */
    function createTokenNFT(string memory tokenURI, uint256 price, string memory propertyAddress, uint256 bidPrice) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId, price, propertyAddress, bidPrice);
      return newTokenId;
    }

    function createMarketItem(
      uint256 tokenId,
      uint256 price,
      string memory propertyAddress,
      uint256 bidPrice
    ) private {
      require(price > 0, "Price must be at least 1 wei");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        propertyAddress,
        bidPrice,
        price,
        0,
        payable(address(this)),
        false
      );

      _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        propertyAddress,
        bidPrice,
        price,
        0,
        payable(address(this)),
        false
      );
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      require(msg.value == price, "Please pay the full amount in order to complete the transaction!");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);

      payable(owner).transfer(msg.value);
    }

    function buyBidProperty(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].bidPrice;
      string memory errMsg= "Please pay the full amount in order to complete the transaction!";
      require(msg.value >= price, concatenate(errMsg, price.toString()));
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);

      payable(owner).transfer(msg.value);
    }

    /* Pay part of the payment */
    function payPartSale(
      uint256 tokenId
      ) public payable {
      uint amountPaid = msg.value;
      idToMarketItem[tokenId].paidAmount += amountPaid;
      if(idToMarketItem[tokenId].paidAmount >= idToMarketItem[tokenId].bidPrice){
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
      }
      payable(owner).transfer(msg.value);
    }

        /* Pay part of the payment */
    function placeDeposit(
      uint256 tokenId
      ) public payable {
        uint price = idToMarketItem[tokenId].bidPrice * 10 / 100;
        require(msg.value >= price, "Please pay the full amount in order to complete the transaction!");
        uint amountPaid = msg.value;
        idToMarketItem[tokenId].paidAmount += amountPaid;
        if(idToMarketItem[tokenId].paidAmount >= idToMarketItem[tokenId].bidPrice){
          idToMarketItem[tokenId].owner = payable(msg.sender);
          idToMarketItem[tokenId].sold = true;
          idToMarketItem[tokenId].seller = payable(address(0));
          _itemsSold.increment();
          _transfer(address(this), msg.sender, tokenId);
        }
        payable(owner).transfer(msg.value);
    }

    function updateBidPrice(uint256 tokenId, uint256 updatedPrice) public {
      idToMarketItem[tokenId].bidPrice = updatedPrice;
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function fetchNFTByPropertyAddress(string memory propertyAddress) public view returns (MarketItem memory) {
      uint totalItemCount = _tokenIds.current();

      MarketItem memory item;
      for (uint i = 0; i < totalItemCount; i++) {
        if (compareStrings(idToMarketItem[i + 1].propertyAddress, propertyAddress)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          item = currentItem;
        }
      }
      return item;
    }
}
