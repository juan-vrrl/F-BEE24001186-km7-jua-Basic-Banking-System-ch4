# Basic Banking System  
## Challenge Chapter 2  

### Juan Verrel Tanuwijaya  
### Class: BEJS-1  

---

## Description

**Basic Banking System** is a REST API simulating a simple banking system. This system allows users to register accounts, create and manage bank accounts, and perform transactions between accounts securely and efficiently.

## Prerequisite
- Node.js v10
- PostgreSQL v14

## How to use
- For database connection, use `DATABASE_URL` from `.env.sample`, copy it to your `.env` file, and change the value accordingly to your user, password, and database name.
- To run the program, use "npm run start" or "npm run dev" (using nodemon).

# API Endpoints

## Users Endpoints

- **POST /users**
  - **Description**: Create a new user.
  - **Input**:
    - `name`: string, user's name.
    - `email`: string, email format.
    - `password`: string, minimum 6 characters.
    - `identityType`: string, type of identity.
    - `identityNumber`: string, identity number.
    - `address`: string, address.

- **GET /users**
  - **Description**: Retrieve all users.
  
- **GET /users/:id**
  - **Description**: Retrieve a user by ID along with profile details.
  
- **PUT /users/:id**
  - **Description**: Update the name, email, or address of a user by ID.
  - **Input**: 
    - `name`: string, user's name. 
    - `email`: string, email format.
    - `address`: string, address.

- **DELETE /users/:id**
  - **Description**: Delete a user by ID.

## Bank Accounts Endpoints

- **POST /accounts**
  - **Description**: Create a new bank account.
  - **Input**:
    - `bankName`: string, name of the bank.
    - `bankAccountNumber`: string, bank account number.
    - `balance`: number, account balance.
    - `userId`: integer, user ID.

- **GET /accounts**
  - **Description**: Retrieve all bank accounts.
  
- **GET /accounts/:id**
  - **Description**: Retrieve a bank account by ID along with the user data of the account owner.

- **DELETE /accounts/:id**
  - **Description**: Delete a bank account by ID.

- **POST /accounts/:id/deposit**
  - **Description**: Add money to the account balance.
  - **Input**:
    - `amount`: number, amount of money.

- **POST /accounts/:id/withdraw**
  - **Description**: Withdraw money from the account balance.
  - **Input**:
    - `amount`: number, amount of money.

## Transactions Endpoints

- **POST /transactions**
  - **Description**: Create a new transaction.
  - **Input**:
    - `amount`: number, amount of money to be transferred.
    - `sourceId`: integer, ID of the sender's account.
    - `destinationId`: integer, ID of the recipient's account.

- **GET /transactions**
  - **Description**: Retrieve all transactions.
  
- **GET /transactions/:id**
  - **Description**: Retrieve a transaction by ID along with information about the sender and recipient accounts.
