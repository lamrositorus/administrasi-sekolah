const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
// Middleware untuk parsing JSON
app.use(express.json());

// Middleware untuk mengizinkan permintaan dari semua domain
app.use(cors());
// Middleware untuk menambahkan header ke semua respons
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Mengimpor rute
const mahasiswaRoutes = require('./router/siswa');
const guruRoutes = require('./router/guru');
const kelasRoutes = require('./router/kelas');
const mataPelajaranRoutes = require('./router/mataPelajaran');
const transaksiKeuanganRoutes = require('./router/transaksiKeuangan');
const kehadiranRoutes = require('./router/kehadiran');
const penggunaRoutes = require('./router/pengguna');
const dashboardRoutes = require('./router/dashboard');
// Menggunakan rute
app.use('/siswa', mahasiswaRoutes);
app.use('/guru', guruRoutes);
app.use('/kelas', kelasRoutes);
app.use('/mataPelajaran', mataPelajaranRoutes);
app.use('/transaksiKeuangan', transaksiKeuanganRoutes);
app.use('/kehadiran', kehadiranRoutes);
app.use('/pengguna', penggunaRoutes);
app.use('/dashboard', dashboardRoutes);
// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
