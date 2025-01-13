import React, { useEffect } from 'react';
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
import { useTheme } from './components/ThemeContext';
import { useLanguage } from './components/LanguageContext';

const App = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Mengambil state tema
  const { language, toggleLanguage } = useLanguage(); // Mengambil state bahasa

  useEffect(() => {
    // Menyimpan nilai tema dan bahasa ke localStorage
    localStorage.setItem('isDarkMode', isDarkMode);
    localStorage.setItem('language', language);
  }, [isDarkMode, language]);

  return (
    <AuthProvider>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
      />
      <Routes>
        <Route path="/" element={<Login isDarkMode={isDarkMode} language={language} />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard isDarkMode={isDarkMode} language={language} /></ProtectedRoute>} />
        <Route path="/siswa" element={<ProtectedRoute><Siswa isDarkMode={isDarkMode} language={language} /></ProtectedRoute>} />
        <Route path="/siswa/:id" element={<DetailSiswa isDarkMode={isDarkMode} language={language} />} />
        <Route path="/guru" element={<ProtectedRoute><Guru isDarkMode={isDarkMode} language={language}/></ProtectedRoute>} />
        <Route path="/guru/:id" element={<DetailGuru isDarkMode={isDarkMode} language={language} />} />
        <Route path="/kelas" element={<ProtectedRoute><Kelas isDarkMode={isDarkMode} language={language}/></ProtectedRoute>} />
        <Route path="/kelas/:id" element={<DetailKelas isDarkMode={isDarkMode} language={language} />} />
        <Route path="/mataPelajaran" element={<ProtectedRoute><MataPelajaran isDarkMode={isDarkMode} language={language}/></ProtectedRoute>} />
        <Route path="/mataPelajaran/:id" element={<DetailMapel isDarkMode={isDarkMode} language={language} />} />
        <Route path="/transaksiKeuangan" element={<ProtectedRoute><TransaksiKeuangan isDarkMode={isDarkMode} language={language}/></ProtectedRoute>} />
        <Route path="/transaksiKeuangan/:id" element={<DetailTransaksi isDarkMode={isDarkMode} language={language}/>} />
        <Route path="/kehadiran" element={<ProtectedRoute><Kehadiran isDarkMode={isDarkMode} language={language}/></ProtectedRoute>} />
        <Route path="/kehadiran/:id" element={<DetailKehadiran isDarkMode={isDarkMode} language={language}/>} />
        <Route path="/pengguna" element={<Signup isDarkMode={isDarkMode} language={language} />} />
        <Route path="/pengguna/:id" element={<Pengguna isDarkMode={isDarkMode} language={language}/>} />
        <Route path="/pengguna/login" element={<Login isDarkMode={isDarkMode} language={language} />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;