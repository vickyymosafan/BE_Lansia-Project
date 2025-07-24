# Aplikasi Kesehatan Lansia

Aplikasi web untuk pencatatan kesehatan lansia dengan teknologi QR Code untuk posyandu digital. Aplikasi ini memungkinkan kader posyandu untuk mengelola data kesehatan lansia dengan mudah dan efisien.

## 🚀 Fitur Utama

- **Pendaftaran Lansia Baru**: Form lengkap untuk mendaftarkan lansia baru dengan data pribadi dan pemeriksaan kesehatan pertama
- **QR Code Generator**: Setiap lansia mendapat QR Code unik untuk akses cepat ke profil mereka
- **QR Code Scanner**: Scan QR Code menggunakan kamera ponsel untuk akses profil lansia
- **Riwayat Pemeriksaan**: Pencatatan dan tampilan riwayat pemeriksaan kesehatan lengkap
- **Dashboard Statistik**: Ringkasan data lansia dan statistik pemeriksaan
- **Responsive Design**: Tampilan yang optimal di desktop, tablet, dan mobile

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety dan better development experience
- **TailwindCSS 4** - Modern CSS framework untuk styling
- **qrcode.react** - QR Code generation
- **@zxing/library** - QR Code scanning
- **Axios** - HTTP client untuk API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **MySQL 2** - Database driver
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database untuk menyimpan data

## 📁 Struktur Project

```
lansia/
├── client/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── form/       # Halaman form pendaftaran
│   │   │   ├── scan/       # Halaman QR scanner
│   │   │   ├── profile/    # Halaman profil lansia
│   │   │   ├── profiles/   # Halaman daftar semua lansia
│   │   │   ├── globals.css # Global styles
│   │   │   ├── layout.tsx  # Root layout
│   │   │   └── page.tsx    # Homepage
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                 # Backend Express.js
│   ├── config/
│   │   └── database.js     # Konfigurasi database
│   ├── index.js           # Main server file
│   ├── simple-server.js   # Server dengan mock data
│   ├── database.sql       # SQL schema
│   ├── package.json
│   └── ...
└── README.md
```

## 🚀 Cara Menjalankan Aplikasi

### Prerequisites
- Node.js (v18 atau lebih baru)
- pnpm (package manager)
- MySQL Server
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd lansia
```

### 2. Setup Database
1. Pastikan MySQL server berjalan
2. Buat database baru:
```sql
CREATE DATABASE lansia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. Import schema database:
```bash
mysql -u root -p lansia < server/database.sql
```

### 3. Setup Backend
```bash
cd server
npm install
```

Untuk development dengan mock data:
```bash
node simple-server.js
```

Untuk production dengan MySQL:
```bash
node index.js
```

Server akan berjalan di `http://localhost:5000`

### 4. Setup Frontend
```bash
cd client
pnpm install
pnpm dev
```

Frontend akan berjalan di `http://localhost:3000`

## 📱 Cara Menggunakan Aplikasi

### Untuk Lansia Baru:
1. Buka aplikasi di browser
2. Klik "Daftar Lansia Baru"
3. Isi formulir data pribadi:
   - Nama lengkap
   - Usia
   - Alamat
   - Riwayat medis (opsional)
4. Isi data pemeriksaan kesehatan:
   - Tekanan darah (format: 120/80)
   - Gula darah (mg/dL)
   - Catatan pemeriksaan (opsional)
5. Klik "Simpan Data"
6. Sistem akan generate QR Code unik
7. Cetak atau simpan QR Code untuk lansia

### Untuk Pemeriksaan Ulang:
1. Klik "Scan QR Code"
2. Izinkan akses kamera
3. Arahkan kamera ke QR Code lansia
4. Sistem akan otomatis membuka profil lansia
5. Lihat riwayat pemeriksaan sebelumnya
6. Klik "Tambah Pemeriksaan Baru" jika diperlukan

### Fitur Tambahan:
- **Daftar Lansia**: Lihat semua lansia terdaftar dengan statistik
- **Input Manual**: Jika QR Code tidak bisa dipindai, gunakan input manual ID
- **Print QR Code**: Cetak QR Code untuk dibagikan ke lansia

## 🗃️ Database Schema

### Tabel `profiles`
```sql
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    usia INT NOT NULL,
    alamat TEXT NOT NULL,
    riwayat_medis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel `checkups`
```sql
CREATE TABLE checkups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    tekanan_darah VARCHAR(20) NOT NULL,
    gula_darah INT NOT NULL,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);
```

## 🔧 API Endpoints

### Profiles
- `POST /api/profiles` - Buat profil baru dengan pemeriksaan pertama
- `GET /api/profiles/:id` - Ambil profil dan riwayat pemeriksaan
- `GET /api/profiles` - Ambil semua profil dengan statistik

### Checkups
- `POST /api/checkups` - Tambah pemeriksaan baru

### Health Check
- `GET /api/health` - Status server

## 🎨 Design System

Aplikasi menggunakan design system modern dengan:
- **Color Palette**: Blue primary, Green accent, Gray neutral
- **Typography**: Geist Sans font family
- **Components**: Reusable UI components dengan TailwindCSS
- **Responsive**: Mobile-first design approach
- **Accessibility**: Focus states dan keyboard navigation

## 🔒 Keamanan

- Input validation di frontend dan backend
- SQL injection protection dengan parameterized queries
- CORS configuration untuk cross-origin requests
- Error handling yang aman tanpa expose sensitive data

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
pnpm build
```

### Backend (Railway/Heroku)
```bash
cd server
npm start
```

### Database (PlanetScale/Railway)
- Setup MySQL database
- Import schema dari `database.sql`
- Update connection string di `config/database.js`

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- **Frontend Developer**: Next.js, TypeScript, TailwindCSS
- **Backend Developer**: Node.js, Express.js, MySQL
- **UI/UX Designer**: Modern, responsive, accessible design

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini atau hubungi tim pengembang.

---

**Aplikasi Kesehatan Lansia** - Memudahkan pelayanan posyandu dengan teknologi modern 🏥💙
