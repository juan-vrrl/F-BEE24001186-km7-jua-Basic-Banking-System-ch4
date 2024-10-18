# Basic Banking System  
## Challenge Chapter 2  

### Juan Verrel Tanuwijaya  
### Kelas: BEJS-1  

---

## Deskripsi

**Basic Banking System** adalah sebuah REST API simulasi sistem perbankan sederhana. Sistem ini memungkinkan pengguna untuk mendaftarkan akun, membuat dan mengelola rekening bank, serta melakukan transaksi antar-rekening secara aman dan efisien.

## Prerequisite
- Node Js v10
- PostgreSQL v14

## How to use
- For database connection use `DATABASE_URL` from `.env.sample` and copy it to your `.env` file, then change the value accordingly to your user, password, and database name.
- For running program use "npm run start" or "npm run dev" (using nodemon).

# API Endpoints

## Users Endpoints

- **POST /users**
  - **Deskripsi**: Membuat pengguna baru.
  - **Input**:
    - `name`: string, nama pengguna.
    - `email`: string, format email.
    - `password`: string, minimal 6 karakter.
    - `identityType`: string, jenis identitas.
    - `identityNumber`: string, nomor identitas.
    - `address`: string, alamat.

- **GET /users**
  - **Deskripsi**: Mengambil semua pengguna.
  
- **GET /users/:id**
  - **Deskripsi**: Mengambil pengguna berdasarkan ID beserta detail profil.
  
- **PUT /users/:id**
  - **Deskripsi**: Memperbarui data nama, email, atau alamat pengguna berdasarkan ID.
  - **Input**: 
    - `name`: string, nama pengguna. 
    - `email`: string, format email.
    - `address`: string, alamat.

- **DELETE /users/:id**
  - **Deskripsi**: Menghapus pengguna berdasarkan ID.


## Bank Accounts Endpoints

- **POST /accounts**
  - **Deskripsi**: Membuat akun bank baru.
  - **Input**:
    - `bankName`: string, nama bank.
    - `bankAccountNumber`: string, nomor rekening bank.
    - `balance`: number, saldo akun.
    - `userId`: integer, ID pengguna.

- **GET /accounts**
  - **Deskripsi**: Mengambil semua akun bank.
  
- **GET /accounts/:id**
  - **Deskripsi**: Mengambil akun bank berdasarkan ID dan data user pemilik akun.

- **DELETE /accounts/:id**
  - **Deskripsi**: Menghapus akun bank berdasarkan ID.

- **POST /accounts/:id/deposit**
  - **Deskripsi**: Menambah uang ke balance akun.
  - **Input**:
    - `amount`: number, jumlah uang.

- **POST /accounts/:id/withdraw**
  - **Deskripsi**: Menarik uang dari balance akun.
  - **Input**:
    - `amount`: number, jumlah uang.

## Transactions Endpoints

- **POST /transactions**
  - **Deskripsi**: Membuat transaksi baru.
  - **Input**:
    - `amount`: number, jumlah uang yang ditransfer.
    - `sourceId`: integer, ID akun pengirim.
    - `destinationId`: integer, ID akun penerima.

- **GET /transactions**
  - **Deskripsi**: Mengambil semua transaksi.
  
- **GET /transactions/:id**
  - **Deskripsi**: Mengambil transaksi berdasarkan ID beserta informasi akun pengirim dan penerima.