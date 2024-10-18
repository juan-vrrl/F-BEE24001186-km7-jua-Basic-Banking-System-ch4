# Basic Banking System  
## Challenge Chapter 2  

### Juan Verrel Tanuwijaya  
### Kelas: BEJS-1  

---

## Deskripsi Singkat  

**Basic Banking System** adalah sebuah REST API simulasi sistem perbankan sederhana. Sistem ini memungkinkan pengguna untuk mendaftarkan akun, membuat dan mengelola rekening bank, serta melakukan transaksi antar-rekening secara aman dan efisien.

## Model

### 1. Model Pengguna (User)
Mewakili pengguna yang terdaftar dalam sistem.
- **`id`**: Pengidentifikasi unik untuk pengguna.
- **`name`**: Nama pengguna.
- **`email`**: Email pengguna (unik).
- **`password`**: Kata sandi pengguna.
- **`created_at`**: Timestamp ketika pengguna dibuat.
- **`updated_at`**: Timestamp saat terakhir pengguna diperbarui.
- **Relasi**:
  - `bank_account`: Relasi one to many dengan `Bank_Account[]`.
  - `profile`: Relasi one to one dengan `Profile`.

### 2. Model Profil (Profile)
Menyimpan data pribadi pengguna.
- **`id`**: Pengidentifikasi unik untuk profil.
- **`user_id`**: Relasi ke pengguna yang bersangkutan.
- **`identity_type`**: Jenis identitas (misalnya KTP, SIM).
- **`identity_number`**: Nomor identitas pengguna.
- **`address`**: Alamat pengguna.
- **Relasi**:
  - `user`: Relasi one to one dengan `User`.

### 3. Model Rekening Bank (Bank_Account)
Menyimpan informasi tentang rekening bank milik pengguna.
- **`id`**: Pengidentifikasi unik untuk rekening bank.
- **`bank_name`**: Nama bank.
- **`bank_account_number`**: Nomor rekening bank.
- **`balance`**: Saldo rekening saat ini.
- **`created_at`**: Timestamp ketika rekening bank dibuat.
- **Relasi**:
  - `send`: Relasi one to many untuk transaksi yang dikirim (`Transaction[]`).
  - `receive`: Relasi one to many untuk transaksi yang diterima (`Transaction[]`).
  - `user`: Relasi one to many dengan `User`.

### 4. Model Transaksi (Transaction)
Mewakili transaksi yang dilakukan antara dua rekening bank.
- **`id`**: Pengidentifikasi unik untuk transaksi.
- **`amount`**: Jumlah uang yang ditransfer.
- **`transaction_time`**: Timestamp ketika transaksi terjadi.
- **`source_account_id`**: ID rekening pengirim.
- **`destination_account_id`**: ID rekening penerima.
- **Relasi**:
  - `source_account`: Relasi ke rekening pengirim (`Bank_Account`).
  - `destination_account`: Relasi ke rekening penerima (`Bank_Account`).

# API Endpoints

## Users Endpoints

- **POST /users**
  - **Deskripsi**: Membuat pengguna baru.
  - **Input**:
    - `name`: string, nama pengguna.
    - `email`: string, format email.
    - `password`: string, minimal 6 karakter.
    - `identity_type`: string, jenis identitas.
    - `identity_number`: string, nomor identitas.
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
    - `bank_name`: string, nama bank.
    - `bank_account_number`: string, nomor rekening bank.
    - `balance`: number, saldo akun.
    - `user_id`: integer, ID pengguna.

- **GET /accounts**
  - **Deskripsi**: Mengambil semua akun bank.
  
- **GET /accounts/:id**
  - **Deskripsi**: Mengambil akun bank berdasarkan ID dan data user pemilik akun.

- **DELETE /accounts/:id**
  - **Deskripsi**: Menghapus akun bank berdasarkan ID.


## Transactions Endpoints

- **POST /transactions**
  - **Deskripsi**: Membuat transaksi baru.
  - **Input**:
    - `amount`: number, jumlah uang yang ditransfer.
    - `source_id`: integer, ID akun pengirim.
    - `destination_id`: integer, ID akun penerima.

- **GET /transactions**
  - **Deskripsi**: Mengambil semua transaksi.
  
- **GET /transactions/:id**
  - **Deskripsi**: Mengambil transaksi berdasarkan ID beserta informasi akun pengirim dan penerima.