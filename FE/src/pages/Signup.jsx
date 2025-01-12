import React, { useState } from 'react';
import { API_Source } from '../global/Apisource';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import { FaUser, FaLock } from 'react-icons/fa'; // Import icons for username and password

export const Signup = ({ isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('stu'); // Default role diatur ke "stu"
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Panggil fungsi signup dengan data yang sesuai
      await API_Source.signup(username, password, role);
      // Setelah signup berhasil, redirect ke halaman login
      navigate('/pengguna/login');
    } catch (err) {
      setError(err.message); // Tampilkan pesan error ke pengguna
      console.error('Signup error:', err);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
    >
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h1
          className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          <FaUser className="inline-block mr-2" /> Sign Up
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}{' '}
        {/* Tampilkan pesan error jika ada */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center border border-gray-300 rounded-md">
            <FaUser className="w-5 h-5 text-gray-400 ml-2" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`mt-1 block w-full p-2 focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              placeholder="Masukkan username Anda"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Password:
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDarkMode={isDarkMode}
              placeholder="Masukkan password Anda"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Role:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            >
              <option value="stu">Siswa</option>
              <option value="tea">Guru</option>
              <option value="adm">Admin</option>
              {/* Tambahkan pilihan role lainnya di sini */}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            Sudah punya akun?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/pengguna/login')} // Ganti '/pengguna/login' dengan route yang sesuai
            >
              Masuk di sini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
