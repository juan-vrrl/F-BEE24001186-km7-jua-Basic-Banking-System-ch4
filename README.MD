# Basic Banking System  
## Challenge Chapter 2  

### Juan Verrel Tanuwijaya  
### Kelas: BEJS-1  

---

## Deskripsi Singkat  

**Basic Banking System** adalah sebuah REST API simulasi sistem perbankan sederhana. Sistem ini memungkinkan pengguna untuk mendaftarkan akun, membuat dan mengelola rekening bank, serta melakukan transaksi antar-rekening secara aman dan efisien.

### Struktur Model

1. **User Model**  
   Mewakili entitas pengguna yang terdaftar dalam sistem.  
   - `id`: ID unik pengguna  
   - `name`: Nama pengguna  
   - `email`: Email pengguna (unik)  
   - `password`: Kata sandi pengguna  
   - Relasi ke `Bank_Account[]` dan `Profile`

2. **Profile Model**  
   Menyimpan data pribadi pengguna.  
   - `id`: ID unik profil  
   - `user_id`: Relasi ke pengguna yang bersangkutan  
   - `identity_type`: Jenis identitas (misalnya KTP, SIM)  
   - `identity_number`: Nomor identitas  
   - `address`: Alamat pengguna  

3. **Bank_Account Model**  
   Menyimpan informasi mengenai rekening bank milik pengguna.  
   - `id`: ID unik rekening bank  
   - `bank_name`: Nama bank  
   - `bank_account_number`: Nomor rekening bank  
   - `balance`: Saldo rekening  
   - Relasi ke pengguna (`User`), transaksi sebagai pengirim  (`Transaction[]`), dan transaksi sebagai penerima (`Transaction[]`)

4. **Transaction Model**  
   Mewakili transaksi yang dilakukan antara dua rekening bank.  
   - `id`: ID unik transaksi  
   - `amount`: Jumlah uang yang ditransfer  
   - `source_account_id`: ID rekening pengirim 
   - `destination_account_id`: ID rekening penerima
   - Relasi ke rekening pengirim (`Bank_Account`) dan rekening penerima (`Bank_Account`)

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
  - **Deskripsi**: Memperbarui pengguna berdasarkan ID.
  - **Input**: Sama dengan input untuk membuat pengguna baru.

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
  - **Deskripsi**: Mengambil akun bank berdasarkan ID.
  
- **PUT /accounts/:id**
  - **Deskripsi**: Memperbarui akun bank berdasarkan ID.
  - **Input**: Sama dengan input untuk membuat akun bank baru.

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
  
- **PUT /transactions/:id**
  - **Deskripsi**: Memperbarui transaksi berdasarkan ID.
  - **Input**: Sama dengan input untuk membuat transaksi baru.

- **DELETE /transactions/:id**
  - **Deskripsi**: Menghapus transaksi berdasarkan ID.
