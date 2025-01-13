import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_Source } from '../global/Apisource'; // Importing the API source
import { useAuth } from '../components/AuthContext'; // Import useAuth untuk mengakses konteks
import PasswordInput from '../components/PasswordInput';
import { FaUser , FaLock } from 'react-icons/fa'; // Import user and lock icons
import { motion } from 'framer-motion'; // Import Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const Login = ({ isDarkMode, language }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State untuk menyimpan pesan error
  const navigate = useNavigate();
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await API_Source.login(username, password); // Panggil fungsi login
      console.log('data: ', data);

      // Simpan data pengguna (userid, role, dll.) setelah login berhasil
      const user = {
        userId: data.userid, // Ambil userId dari data
        username: data.username,
        role: data.role,
        // Tambahkan properti lain jika diperlukan
      };
      login(user); // Panggil fungsi login dari AuthContext untuk menyimpan data pengguna

      navigate('/dashboard'); // Redirect ke halaman dashboard
    } catch (err) {
      console.error('Login error:', err);
      setError('Login gagal. Silakan periksa username dan password Anda.'); // Tampilkan pesan error
      Swal.fire({
        icon: 'error',
        title: language === 'en' ? 'Login Failed' : 'Login Gagal',
        text: language === 'en' ? 'Please check your username and password.' : 'Silakan periksa username dan password Anda.',
      });
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={`shadow-md rounded-lg p-8 w-full max-w-sm ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <h1
          className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          <FaUser  className="inline-block mr-2" /> {language === 'en' ? 'Login' : 'Masuk'}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Tampilkan pesan error jika ada */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center border border-gray-300 rounded-md">
            <FaUser  className="w-5 h-5 text-gray-400 ml-2" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`bg-transparent block w-full p-2 focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              placeholder={language === 'en' ? 'Enter your username' : 'Masukkan username Anda'}
            />
          </div>
          <div className="mb-4">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDarkMode={isDarkMode}
              placeholder={language === 'en' ? 'Enter your password' : 'Masukkan password Anda'}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            {language === 'en' ? 'Login' : 'Masuk'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            {language === 'en' ? 'Don\'t have an account?' : 'Belum punya akun?'}{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/pengguna')} // Ganti '/signup' dengan route yang sesuai
            >
              {language === 'en' ? 'Sign up here' : 'Daftar di sini'}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;