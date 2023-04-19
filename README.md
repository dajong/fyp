# Real estate web application leveraging blockchain technology

### Introduction
This is a final year project for Technological University of Shannon. RealEstateChain is a web application that allows users to buy, sell, and manage real estate properties using blockchain technology. The application ensures transparency, security, and efficiency in real estate transactions by leveraging the power of decentralized ledger technology.

This README provides an overview of the project, instructions on how to set up and use the application, and information about contributing to the project.

### Prerequisites
Before you can run the RealEstateChain application, ensure you have the following installed on your system:

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- MongoDB (version 4.x or higher)

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

3) Starts a local Ethereum node:
``` shell
npx hardhat node
```

4) Deploy smart contract to the local Hardhat Network:
``` shell
npx hardhat run scripts/deploy.js --network localhost
```

### Author

- Name: Daniel Jong
- KNumber: K00244549
- Course: Software Development

