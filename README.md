📈 Marketing Engagement Tracker

Aplikasi pelacak kinerja pemasaran (Marketing Tracker) berbasis web yang modern, responsif, dan mudah digunakan. Aplikasi ini dirancang untuk tim marketing guna mencatat prospek (leads), melacak performa influencer, dan memantau KPI (Key Performance Indicators) secara real-time.

Ditenagai oleh React di frontend dan Google Sheets sebagai database backend gratis dan fleksibel melalui Google Apps Script.

✨ Fitur Utama

1. 📝 Input Data Prospek (Daily Log)

Formulir Intuitif: Input data prospek baru dengan mudah melalui modal pop-up yang rapi.

Validasi Otomatis: Memastikan nama dan link profil LinkedIn terisi.

Pencarian Cepat: Fitur pencarian real-time untuk menemukan data prospek berdasarkan nama.

Filter Cerdas: Aplikasi otomatis mengabaikan baris header atau data sampah dari spreadsheet.

2. 📊 Dashboard KPI (Real-time)

Ringkasan Statistik: Lihat total leads, direct asks, dan conversion rate secara instan.

Visualisasi Data: Kartu statistik yang jelas dan mudah dibaca.

Analisis Konversi: Melacak seberapa efektif strategi pemasaran Anda dalam mengubah prospek menjadi klien.

3. 🌟 Analisis Influencer & Sumber

Pelacakan Sumber: Identifikasi sumber trafik terbaik (misal: "Viral Post #1" atau "IG Story @InfluencerA").

Rating Otomatis: Sistem penilaian otomatis (Excellent/Good/Average) berdasarkan jumlah leads yang dihasilkan oleh setiap sumber.

4. 🌓 Tampilan Modern & Responsif

Mode Gelap (Dark Mode): Dukungan penuh untuk tema terang dan gelap sesuai preferensi pengguna.

Mobile Friendly: Tampilan yang optimal di perangkat seluler dengan navigasi bar di bagian bawah.

Notifikasi Toast: Umpan balik visual yang elegan saat data berhasil disimpan atau gagal.

🚀 Cara Instalasi & Penggunaan

Prasyarat

Node.js (versi 16 atau lebih baru)

Akun Google (untuk Google Sheets)

Langkah 1: Persiapan Google Sheets (Backend)

Buat Google Sheet baru di Google Drive Anda.

Beri nama Sheet (Tab) utama sebagai Sheet1 (atau sesuaikan, default biasanya Sheet1).

Buat Header di Baris 1 dengan urutan persis seperti ini:

Date of Contact

Lead Name

LinkedIn Profile URL

Industry/Role

Source Post/Influencer

Template Used

Interaction Type

Jonathan Tagged?

Response Time

Conversion Status

Notes/Feedback

Marketer

Langkah 2: Setup Google Apps Script

Di Google Sheet, klik menu Extensions > Apps Script.

Hapus kode yang ada, lalu salin kode backend (tersedia di dokumentasi terpisah atau minta kepada pengembang).

Klik Deploy > New Deployment.

Pilih type Web App.

Konfigurasi:

Description: "Versi 1"

Execute as: "Me" (email Anda)

Who has access: "Anyone" (Siapa saja)

Klik Deploy dan salin Web App URL (akhiran /exec).

Langkah 3: Setup Aplikasi React (Frontend)

Clone repository ini atau download source code.

Buka file src/App.tsx.

Cari variabel GAS_API_URL di bagian atas file.

Ganti nilainya dengan URL Web App yang Anda salin di Langkah 2.

const GAS_API_URL = "[https://script.google.com/macros/s/...../exec](https://script.google.com/macros/s/...../exec)";


Buka terminal di folder proyek dan jalankan perintah:

# Install dependencies
npm install

# Jalankan server development
npm run dev


Buka browser di alamat yang muncul (biasanya http://localhost:5173).

🛠️ Teknologi yang Digunakan

React: Framework UI utama.

Vite: Build tool yang super cepat.

TypeScript: Untuk keamanan tipe data dan pengembangan yang lebih baik.

Google Apps Script: Sebagai API serverless untuk menghubungkan React dengan Google Sheets.

CSS-in-JS: Styling dinamis tanpa library CSS berat.

📝 Panduan Pengisian Form "Add New Lead"

Saat menambahkan lead baru, berikut panduan pengisian kolomnya:

Lead Name: Nama lengkap orang yang dihubungi.

LinkedIn URL: Link profil LinkedIn mereka.

Industry: Bidang pekerjaan mereka (misal: IT, Finance).

Source / Post: Dari mana mereka tahu kita? (misal: Postingan Viral #1).

Type:

Direct Ask: Mereka bertanya duluan.

Offered: Kita menawarkan jasa/produk.

Tagged?: Centang jika mereka men-tag kita di komentar.

Notes: Catatan tambahan penting.

Dibuat dengan ❤️ untuk Tim Marketing Swakarsa Digital.