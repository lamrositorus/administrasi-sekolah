import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard, Siswa, Guru, Signup, Login, Kelas, MataPelajaran, TransaksiKeuangan, Kehadiran, Pengguna, DetailGuru, DetailKehadiran, DetailKelas, DetailMapel, DetailSiswa, DetailTransaksi } from './pages';
import Header from './pages/Header';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Header /> {/* Menambahkan Header di atas */}
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/siswa" element={
          <ProtectedRoute>
            <Siswa />
          </ProtectedRoute>
        } />
        <Route path="/siswa/:id" element={
          
            <DetailSiswa />
          
        } />
        <Route path="/guru" element={
          <ProtectedRoute>
            <Guru />
          </ProtectedRoute>
        } />
        <Route path="/guru/:id" element={
          <ProtectedRoute>
            <DetailGuru />
          </ProtectedRoute>
        } />
        <Route path="/kelas" element={
          <ProtectedRoute>
            <Kelas />
          </ProtectedRoute>
        } />
        <Route path="/kelas/:id" element={
          <ProtectedRoute>
            <DetailKelas />
          </ProtectedRoute>
        } />
        <Route path="/mataPelajaran" element={
          <ProtectedRoute>
            <MataPelajaran />
          </ProtectedRoute>
        } />
        <Route path="/mataPelajaran/:id" element={
          <ProtectedRoute>
            <DetailMapel />
          </ProtectedRoute>
        } />
        <Route path="/transaksiKeuangan" element={
          <ProtectedRoute>
            <TransaksiKeuangan />
          </ProtectedRoute>
        } />
        <Route path="/transaksiKeuangan/:id" element={
          <ProtectedRoute>
            <DetailTransaksi />
          </ProtectedRoute>
        } />
        <Route path="/kehadiran" element={
          <ProtectedRoute>
            <Kehadiran />
          </ProtectedRoute>
        } />
        <Route path="/kehadiran/:id" element={
          <ProtectedRoute>
            <DetailKehadiran />
          </ProtectedRoute>
        } />
        <Route path="/pengguna" element={
          
            <Signup />
          
        } />
        <Route path="/pengguna/:id" element={
          
            <Pengguna />
          
        } />
        <Route path="/pengguna/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;