import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  Dashboard,
  Siswa,
  Guru,
  Signup,
  Login,
  Kelas,
  MataPelajaran,
  TransaksiKeuangan,
  Kehadiran,
  Pengguna,
  DetailGuru,
  DetailKehadiran,
  DetailKelas,
  DetailMapel,
  DetailSiswa,
  DetailTransaksi,
} from './pages';
import Header from './pages/Header';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // State untuk mode gelap
  const [language, setLanguage] = useState('en'); // State untuk bahasa

  return (
    <AuthProvider>
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setLanguage={setLanguage}
      />{' '}
      {/* Menambahkan Header di atas */}
      <Routes>
        <Route
          path="/"
          element={<Login isDarkMode={isDarkMode} language={language} />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa"
          element={
            <ProtectedRoute>
              <Siswa />
            </ProtectedRoute>
          }
        />
        <Route path="/siswa/:id" element={<DetailSiswa />} />
        <Route
          path="/guru"
          element={
            <ProtectedRoute>
              <Guru />
            </ProtectedRoute>
          }
        />
        <Route path="/guru/:id" element={<DetailGuru />} />
        <Route
          path="/kelas"
          element={
            <ProtectedRoute>
              <Kelas />
            </ProtectedRoute>
          }
        />
        <Route path="/kelas/:id" element={<DetailKelas />} />
        <Route
          path="/mataPelajaran"
          element={
            <ProtectedRoute>
              <MataPelajaran />
            </ProtectedRoute>
          }
        />
        <Route path="/mataPelajaran/:id" element={<DetailMapel />} />
        <Route
          path="/transaksiKeuangan"
          element={
            <ProtectedRoute>
              <TransaksiKeuangan />
            </ProtectedRoute>
          }
        />
        <Route path="/transaksiKeuangan/:id" element={<DetailTransaksi />} />
        <Route
          path="/kehadiran"
          element={
            <ProtectedRoute>
              <Kehadiran />
            </ProtectedRoute>
          }
        />
        <Route path="/kehadiran/:id" element={<DetailKehadiran />} />
        <Route path="/pengguna" element={<Signup />} />
        <Route path="/pengguna/:id" element={<Pengguna />} />
        <Route
          path="/pengguna/login"
          element={<Login isDarkMode={isDarkMode} language={language} />}
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
