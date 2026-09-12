# KarsaDev Mobile

KarsaDev Mobile adalah aplikasi web front-end untuk manajemen tugas dan pembelajaran siswa PPLG. Aplikasi ini dibuat dengan React + Vite dan menampilkan fitur login, pendaftaran, dashboard tugas, riwayat pengumpulan, bantuan, pengaturan profil, serta tema gelap/terang.

## Fitur utama

- Halaman login dan register
- Dashboard tugas siswa
- Filter tugas berdasarkan kondisi, mapel, dan kategori
- Fitur reminder / pengingat tugas
- Riwayat pengumpulan tugas
- Panduan bantuan dan FAQ
- Pengaturan profil dan akun
- Tema gelap/terang dengan localStorage
- Notifikasi simulasi dan tombol aksi UI

## Stack teknologi

- React 19
- Vite 8
- React Router DOM
- Tailwind CSS
- Lucide React
- Recharts
- @dnd-kit untuk drag and drop

## Struktur folder

- src/App.jsx : routing utama aplikasi
- src/layouts/DashboardLayout.jsx : layout sidebar/header/dashboard
- src/pages/Login.jsx : halaman login
- src/pages/Register.jsx : halaman register
- src/pages/DashboardHome.jsx : halaman utama dashboard tugas
- src/pages/History.jsx : riwayat pengumpulan
- src/pages/Help.jsx : pusat bantuan dan FAQ
- src/pages/Settings.jsx : pengaturan profil & keamanan
- src/hooks/useTheme.js : logika dark mode
- src/index.css : custom styling dan theme variable

## Cara menjalankan aplikasi

1. Masuk ke folder project
   ```bash
   cd "c:\Users\aryan\OneDrive\Documents\Tugas_PPLG\Mapel_pak_wanda\tugasAI1\karsadev-mobile"
   ```

2. Install dependency
   ```bash
   npm install
   ```

3. Jalankan aplikasi
   ```bash
   npm run dev
   ```

4. Build produksi
   ```bash
   npm run build
   ```

## Cara kerja aplikasi

### 1. Entry point
File utama yang menjalankan routing aplikasi adalah [src/App.jsx](src/App.jsx). Di sini aplikasi menentukan route:

- /login
- /register
- /dashboard
- /dashboard/history
- /dashboard/help
- /dashboard/settings

Semua route dibuat dengan React Router sehingga halaman berpindah tanpa reload penuh.

### 2. Login dan register
Halaman login dan register berfungsi seperti UI autentikasi yang sederhana. Ketika form dikirim, aplikasi hanya melakukan navigasi ke halaman dashboard atau kembali ke login. Ini bersifat front-end demo dan belum terhubung ke backend autentikasi real.

### 3. Layout dashboard
File [src/layouts/DashboardLayout.jsx](src/layouts/DashboardLayout.jsx) menangani:

- sidebar navigasi
- topbar pencarian
- notifikasi
- profil user
- tombol switch tema
- routing outlet ke halaman yang dipilih

File ini berperan sebagai template umum agar semua halaman dashboard memiliki tampilan yang seragam.

### 4. Dashboard tugas
File [src/pages/DashboardHome.jsx](src/pages/DashboardHome.jsx) adalah halaman paling kompleks. Di sini aplikasi menampilkan:

- daftar tugas dan LKPD
- filter mapel dan status
- modal untuk menambahkan tugas baru
- reminder atau alarm tugas
- drag-and-drop card list
- grafik statistik menggunakan Recharts

Komponen utama di sini juga memiliki fungsi seperti:

- `scheduleReminder()` untuk mensimulasikan notifikasi alarm tugas
- `simulateNewNotification()` untuk memberi notifikasi baru
- `useSortable()` dan `DndContext` untuk drag-and-drop

### 5. Riwayat tugas
File [src/pages/History.jsx](src/pages/History.jsx) menampilkan daftar tugas yang sudah dikumpulkan dan dinilai. Di sana terdapat:

- pencarian berdasarkan judul atau mata pelajaran
- filter semester
- tampilan status tugas dan nilai akhir

### 6. Panduan dan pengaturan
File [src/pages/Help.jsx](src/pages/Help.jsx) berisi FAQ dan panduan misi siswa, sedangkan [src/pages/Settings.jsx](src/pages/Settings.jsx) menampilkan pengaturan akun dan profil pengguna.

### 7. Dark mode
File [src/hooks/useTheme.js](src/hooks/useTheme.js) mengelola tema aplikasi. Nilai theme disimpan di `localStorage`, sehingga saat halaman direload tema tetap dipertahankan.

## Penjelasan source code penting

### src/App.jsx
File ini menjadi pusat routing aplikasi dan mengatur navigasi antar halaman.

### src/layouts/DashboardLayout.jsx
File ini membangun layout umum untuk user yang sudah login, termasuk sidebar, topbar, notifikasi, dan profile.

### src/pages/DashboardHome.jsx
File ini adalah halaman utama dashboard. Di sini banyak logika UI seperti modal, card drag-and-drop, dan simulasi reminder.

### src/pages/History.jsx
Halaman ini menampilkan kumpulan tugas yang sudah selesai dan nilainya.

### src/pages/Help.jsx
Bagian dokumentasi bantuan pengguna dan FAQ.

### src/pages/Settings.jsx
Bagian pengaturan akun dan profil. Mendukung perubahan data profil dan notifikasi.

### src/hooks/useTheme.js
Menangani perubahan tema UI dan penyimpanan preferensi pengguna.

## Catatan pengembangan

Aplikasi ini saat ini bersifat sebagai prototype front-end. Artinya:

- belum terhubung ke backend/API riil
- login/register masih bersifat simulasi
- data tugas, notifikasi, dan profil bersifat hardcoded

Tujuannya adalah untuk memberikan gambaran UI/UX aplikasi manajemen tugas sekolah yang modern dan fungsional.

## Lisensi

Project ini menggunakan lisensi Apache 2.0 di beberapa file source utama.

## Referensi tambahan

Untuk dokumentasi yang lebih rinci, lihat file [DOCUMENTATION.md](DOCUMENTATION.md).
