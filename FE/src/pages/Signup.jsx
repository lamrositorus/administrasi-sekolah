import React, { useState } from 'react';
import { API_Source } from '../global/Apisource';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import { FaUser  } from 'react-icons/fa'; // Import icons for username
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const Signup = ({ isDarkMode, language }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('stu'); // Default role diatur ke "stu"
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Konfirmasi menggunakan SweetAlert
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to create a new account.' : 'Anda akan membuat akun baru.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, sign up!' : 'Ya, daftar!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        // Panggil fungsi signup dengan data yang sesuai
        await API_Source.signup(username, password, role);
        // Setelah signup berhasil, redirect ke halaman login
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Success!' : 'Sukses!',
          text: language === 'en' ? 'Account created successfully!' : 'Akun telah dibuat dengan sukses!',
        });
        navigate('/pengguna/login');
      } catch (err) {
        setError(err.message); // Tampilkan pesan error ke pengguna
        console.error('Signup error:', err);
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
    >
      <div className={`shadow-md rounded-lg p-8 w-full max-w-sm ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <motion.h1
          className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaUser  className="inline-block mr-2" /> {language === 'en' ? 'Sign Up' : 'Daftar'}
        </motion.h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Tampilkan pesan error jika ada */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center border border-gray-300 rounded-md">
            <FaUser  className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ml-2`} />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`block w-full p-2 focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-transparent text-white' : 'bg-white'}`}
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
          <div className="mb-4">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={`mt-1 block w-full p -2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
            >
              <option value="stu">{language === 'en' ? 'Student' : 'Siswa'}</option>
              <option value="tea">{language === 'en' ? 'Teacher' : 'Guru'}</option>
              <option value="adm">{language === 'en' ? 'Admin' : 'Admin'}</option>
              {/* Tambahkan pilihan role lainnya di sini */}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            {language === 'en' ? 'Sign Up' : 'Daftar'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            {language === 'en' ? 'Already have an account? ' : 'Sudah punya akun? '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/pengguna/login')} // Ganti '/pengguna/login' dengan route yang sesuai
            >
              {language === 'en' ? 'Log in here' : 'Masuk di sini'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};