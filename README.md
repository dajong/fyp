# Real estate web application leveraging blockchain technology

## Introduction
This is a final year project for Technological University of Shannon. RealEstateChain is a web application that allows users to buy, rent, and manage real estate properties using blockchain technology. The application ensures transparency, security, and efficiency in real estate transactions by leveraging the power of decentralized ledger technology. 

This README provides an overview of the project, instructions on how to set up and use the application.

## Main Technology Stack

- Frontend: PUG, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB, Mongoose, Infura IPFS

## Prerequisites
Before you can run the RealEstateChain application, ensure you have the following installed on your system:

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- MetaMask (browser extension is recommended)

## Tools needed 

- IDE (Visual Studio Code is recommended)
- Mongo Compass ( To manage database )

## Installation

1) Clone the repository:
``` shell
git clone https://github.com/dajong/fyp.git
```

2) Navigate to the project folder:
``` shell
cd RealEstateChain
```

3) Install the required dependencies:
``` shell
npm install
```

3) Starts a local Ethereum network:
``` shell
npx hardhat node
```

4) Deploy smart contract to the local Hardhat Network:
``` shell
npx hardhat run scripts/deploy.js --network localhost
```

5) Running the application:
``` shell
npm start
```

6) To access the application, run  `http://localhost:3000` on your browser.

7) If you would love to run the test suite: 
```
npm test
```

## MetaMask TestNet Setup

- After setting up your wallet, go to `account > settings > advanced`, switch on the `show test networks` option.

- Next go to `networks`, and select `add a network`.

- Enter the following details:
    - Network name: Localhost 8545
    - New RPC URL: http://localhost:8545
    - Chain ID: 1337
    - Current symbol: ETH

- If you have run the command `npx hardhat node`, you should have a list of test accounts.

- Go to `import accounts` and enter the private key string.

- The test account should be imported with 10k ETH now, you can add two or more for each test users.

## Special notes to reader 
- Due to the fact that this project is designed to be running in localhost, the usage of this application will be more complicated. If you restart the blockchain network, data will be lost, but the properties in the database will persists. Therefore, in order to keep them in sync, please delete the properties and add them into the database again whenever you restart the blockchain network. Sorry for the inconvenience.

- A regular error that would occur for the test network is `transaction nonce too high`. If you want to know more about this issue you can visit this [link](https://stackoverflow.com/questions/65775136/what-to-do-about-transaction-nonce-too-high-errors-in-rsk). To solve this issue, follow the steps below:
    - Go to `Settings`
    - Click on `Advanced`
    - Hit `Reset Account`

- Remember to manually switch accounts in MetaMask when you're acting as different users since there is currently no way for the application to disconnect your wallet.

## Author

- Name: Daniel Jong
- KNumber: K00244549
- Course: Software Development

