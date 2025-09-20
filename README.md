# 🚀 Express + PostgreSQL REST API – Proyek Belajar Backend (Updated Routes)

> Aplikasi backend sederhana berbasis Node.js dan Express untuk mengasah skill pengembangan API RESTful menggunakan PostgreSQL sebagai database. Proyek ini dirancang sebagai latihan pribadi untuk memahami arsitektur backend, otentikasi, otorisasi, dan pemisahan tanggung jawab di dalam aplikasi.

---

## 🔧 Tujuan Proyek

Proyek ini dibuat sebagai **latihan belajar** untuk memperdalam pemahaman tentang:

- Pengembangan API RESTful dengan pola routing modular
- Otentikasi dan otorisasi (JWT + Role-based Access Control)
- Interaksi dengan database PostgreSQL
- Pemisahan lapisan: Controller → Service → Repository/Query
- Middleware untuk validasi dan keamanan
- Struktur route yang terpisah antara publik dan admin

---

## 📂 Struktur Proyek

```
src/
├── auth/                    # Manajemen autentikasi (login, logout)
│   ├── auth.controller.js
│   ├── auth.routes.js
│   └── auth.service.js
│
├── config/                  # Konfigurasi database dan lainnya
│   └── db.js
│
├── database/                # Migrasi dan query SQL
│   ├── migrations/          # Migrasi tabel (e.g., users, products)
│   └── queries/             # Query khusus (CRUD, others, seed)
│
├── middleware/              # Middleware tambahan
│   ├── auth.middleware.js   # Verifikasi token & role
│   └── validation.middleware.js
│
├── modules/                 # Modul bisnis utama (product, service)
│   ├── product/             # Produk (publik & terbatas)
│   │   ├── product.controller.js
│   │   ├── product.public.routes.js  # Route publik
│   │   ├── product.routes.js         # Route terproteksi
│   │   ├── product.service.js
│   │   └── ...
│   │
│   └── service/             # Layanan (publik & terbatas)
│       ├── service.controller.js
│       ├── service.public.routes.js
│       ├── service.routes.js
│       └── service.service.js
│
├── utils/                   # Fungsi utilitas
│   ├── tokenBlacklist.js    # Manajemen blacklist token
│   ├── app.js               # Inisialisasi express app
│   └── server.js            # Jalankan server
│
├── .env                     # Variabel lingkungan
├── package.json
└── README.md
```

---

## 🔐 Otentikasi & Otorisasi 

### Role-Based Access Control (RBAC)

| Peran   | Akses |
|--------|-------|
| `admin` | Bisa mengakses semua endpoint CRUD produk & layanan, serta `/api/auth/users` |
| `user`  | Hanya bisa login, logout, lihat profile, dan akses endpoint publik |

### Fitur Otentikasi

- **Login/Register**: Dapat diakses publik.
- **Logout**: Membutuhkan token (blacklist token).
- **Profile**: Hanya bisa diakses user yang sudah login.
- **List Users**: Hanya admin.
- **CRUD Produk/Layanan**: Hanya admin.

---

## 🛠️ Arsitektur & Alur Kerja 

### Flow Request Umum

```text
Client → [Public Route? → Langsung ke Controller]
        → [Protected Route? → AuthenticateToken → AuthorizeRole → Controller]
```

### Struktur Routing Utama (`app.js`)

```js
// ===== PUBLIC ACCESS ===== 
app.use('/api/auth', authRoutes)                 // register, login, logout, profile, users*
app.use('/api/products/public', productPublic)   // GET /
app.use('/api/services/public', servicePublic)   // GET /

// ===== ADMIN ACCESS ===== 
app.use(authenticateToken)                       // Semua route di bawah ini butuh token
app.use('/api/products', authorizeRole('admin'), productRoutes)  // CRUD penuh
app.use('/api/services', authorizeRole('admin'), serviceRoutes)  // CRUD penuh
```

> ⚠️ Catatan:  
> - Endpoint `/api/auth/users` hanya bisa diakses admin meskipun di bawah `/api/auth`.  
> - Endpoint `/api/auth/profile` bisa diakses user biasa yang sudah login.  
> - Semua endpoint di bawah `/api/products` dan `/api/services` (tanpa `/public`) hanya bisa diakses admin.

---

## 💾 Database & Migrations

Tidak ada perubahan — tetap menggunakan PostgreSQL lokal dengan migrasi SQL.

---

## 📡 Endpoint API (Updated & Lengkap)

### 🔓 Public Routes (Tidak perlu login)

#### Auth
| Endpoint | Metode | Deskripsi |
|----------|--------|-----------|
| `POST /api/auth/register` | POST | Daftar pengguna baru |
| `POST /api/auth/login`    | POST | Login dan dapatkan token |

#### Produk Publik
| Endpoint | Metode | Deskripsi |
|----------|--------|-----------|
| `GET /api/products/public` | GET | Daftar produk (akses publik) |

#### Layanan Publik
| Endpoint | Metode | Deskripsi |
|----------|--------|-----------|
| `GET /api/services/public` | GET | Daftar layanan (akses publik) |

#### Root
| Endpoint | Metode | Deskripsi |
|----------|--------|-----------|
| `GET /` | GET | Halaman utama aplikasi |

---

### 🔐 Protected Routes (Perlu token + role)

#### Profile & Logout (User & Admin)
| Endpoint | Metode | Role | Deskripsi |
|----------|--------|------|-----------|
| `GET /api/auth/profile` | GET | User/Admin | Lihat profil pengguna yang sedang login |
| `POST /api/auth/logout` | POST | User/Admin | Logout dan blacklist token |

#### Manajemen User (Admin Only)
| Endpoint | Metode | Role | Deskripsi |
|----------|--------|------|-----------|
| `GET /api/auth/users` | GET | Admin | Lihat daftar semua pengguna |

#### Produk (Admin Only)
| Endpoint | Metode | Deskripsi |
|----------|--------|-----------|
| `POST /api/products` | POST | Tambah produk |
| `GET /api/products` | GET | Lihat semua produk |
| `GET /api/products/:id` | GET | Lihat detail produk |
| `PUT /api/products/:id` | PUT | Update produk |
| `DELETE /api/products/:id` | DELETE | Hapus produk |

#### Layanan (Admin Only)
| Endpoint | Metode | Deskripsi |
|----------|--------|-----------|
| `POST /api/services` | POST | Tambah layanan |
| `GET /api/services` | GET | Lihat semua layanan |
| `GET /api/services/:id` | GET | Lihat detail layanan |
| `PUT /api/services/:id` | PUT | Update layanan |
| `DELETE /api/services/:id` | DELETE | Hapus layanan |

> 🚫 Semua endpoint di atas `/api/products` dan `/api/services` (tanpa `/public`) **wajib admin**.

---

## 🛠️ Teknologi yang Digunakan

Tidak ada perubahan — tetap menggunakan:

| Komponen | Teknologi |
|--------|---------|
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Otentikasi | JWT + Token Blacklist |
| Middleware | Custom `authenticateToken` dan `authorizeRole` |
| Tools | nodemon, dotenv, pg |

---

## 🚀 Cara Menjalankan Aplikasi

Tidak ada perubahan — tetap ikuti langkah:

```bash
npm install
cp .env.example .env   # lalu isi sesuai konfigurasi Anda
npm run dev
```

---

## 📝 Catatan Pembelajaran 

Dengan update ini, saya belajar:

- **Pemisahan route publik vs admin** secara eksplisit di level aplikasi (`app.js`).
- **Middleware global** (`authenticateToken`) bisa diterapkan sebelum route tertentu.
- **Granular authorization** dengan `authorizeRole` di route spesifik.
- **Desain API yang lebih aman dan intuitif**, karena endpoint publik dan admin benar-benar dipisah.

---

## 🤝 Kontribusi

Proyek ini adalah **latihan pribadi**, jadi tidak dibuka untuk kontribusi eksternal. Namun, siapa pun boleh mengambil inspirasi dari struktur dan desainnya.

---

## 📄 Lisensi

MIT License — Gratis untuk digunakan, dimodifikasi, dan didistribusikan untuk tujuan belajar.

---

## 🙌 Terima Kasih

Terima kasih kepada semua sumber daya online, dokumentasi Express & PostgreSQL, dan komunitas developer yang membantu saya belajar!
