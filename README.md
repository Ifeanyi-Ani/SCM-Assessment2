# Ethereum Smart Contract Interaction with React and MetaMask

This project demonstrates how to build a web application using Next.js that interacts with an Ethereum smart contract deployed on the Ethereum blockchain. The application allows users to connect their MetaMask wallet, check their account balance, deposit, transfer, and withdraw funds, and view their transaction history.

## Prerequisites

Before getting started, make sure you have the following prerequisites installed:

- Node.js and npm (Node Package Manager): You can download and install Node.js from [nodejs.org](https://nodejs.org/).

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/ethereum-react-metamask.git
   cd ethereum-react-metamask
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   - Open two additional terminals in your VS code
   - In the second terminal type:
     ```bash
     npx hardhat node
     ```
   - In the third terminal, type:
     ```bash
     npx hardhat run --network localhost scripts/deploy.js
     ```
   - Back in the first terminal, type

     ```bash
     npm run dev

     ```

4. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Usage

### Connecting MetaMask Wallet

1. Install the MetaMask extension in your browser if you haven't already. You can download it from the [MetaMask website](https://metamask.io/).

2. Click the "Connect Wallet" button in the application. MetaMask will prompt you to connect your Ethereum account.

### Checking Balance

- Once connected, your Ethereum account balance will be displayed on the main page.

### Making Transactions

#### Deposit

- To deposit funds, enter the deposit amount, and a remark in the respective input fields.

- Click the "Deposit" button to initiate the deposit transaction.

#### Transfer

- To send funds to another Ethereum address, enter the recipient's address, the transfer amount, and a remark.

- Click the "Send" button to initiate the transfer transaction.

#### Withdraw

- To withdraw funds from your account, enter the withdrawal amount and a remark.

- Click the "Withdraw" button to initiate the withdrawal transaction.

### Transaction History

- The "Transaction History" section displays a table with details of past transactions, including sender, recipient, transaction type, remark, and the amount in hexadecimal format.

## Smart Contract

The Ethereum smart contract used in this project is defined in the `Assessment.sol` file. It includes functions for depositing, withdrawing, and transferring funds, as well as functions to retrieve account balance and transaction history.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/new-feature
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Add new feature"
   ```

4. Push your changes to your forked repository:

   ```bash
   git push origin feature/new-feature
   ```

5. Create a pull request to merge your changes into the main repository.
