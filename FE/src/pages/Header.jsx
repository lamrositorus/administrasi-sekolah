import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Import useAuth to get user information
import { useNavigate } from 'react-router-dom';

const Header = ({ isDarkMode, setIsDarkMode, language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user information and logout function from context

  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <header
      className={`py-4 px-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard App</h1>
        <button
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 focus:outline-none"
          onClick={toggleMenu}
        >
          <span
            className={`block w-8 h-1 ${isDarkMode ? 'bg-white' : 'bg-black'} mb-1 transition-transform duration-300 ${isOpen ? 'transform rotate-45 translate-y-1' : ''}`}
          ></span>
          <span
            className={`block w-8 h-1 ${isDarkMode ? 'bg-white' : 'bg-black'} mb-1 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          ></span>
          <span
            className={`block w-8 h-1 ${isDarkMode ? 'bg-white' : 'bg-black'} transition-transform duration-300 ${isOpen ? 'transform -rotate-45 -translate-y-1' : ''}`}
          ></span>
        </button>
        <nav
          className={`md:flex ${isOpen ? 'block mt-9' : 'hidden'} absolute md:static ${isDarkMode ? 'bg-gray-900' : 'bg-white'} md:bg-transparent w-full md:w-auto top-16 left-0`}
        >
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0">
            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-green-500">
                    Dashboard
                  </Link>
                </li>
                {user.role === 'adm' && (
                  <>
                    <li>
                      <Link to="/siswa" className="hover:text-green-500">
                        Siswa
                      </Link>
                    </li>
                    <li>
                      <Link to="/guru" className="hover:text-green-500">
                        Guru
                      </Link>
                    </li>
                    <li>
                      <Link to="/kelas" className="hover:text-green-500">
                        Kelas
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/mataPelajaran"
                        className="hover:text-green-500"
                      >
                        Mata Pelajaran
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/transaksiKeuangan"
                        className="hover:text-green-500"
                      >
                        Transaksi Keuangan
                      </Link>
                    </li>
                    <li>
                      <Link to="/kehadiran" className="hover:text-green-500">
                        Kehadiran
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/pengguna/${user.userId}`}
                        className="hover:text-green-500"
                      >
                        Profile
                      </Link>
                    </li>
                  </>
                )}
                {user.role === 'tea' && (
                  <>
                    <li>
                      <Link to="/siswa" className="hover:text-green-500">
                        Siswa
                      </Link>
                    </li>
                    <li>
                      <Link to="/kelas" className="hover:text-green-500">
                        Kelas
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/mataPelajaran"
                        className="hover:text-green-500"
                      >
                        Mata Pelajaran
                      </Link>
                    </li>
                    <li>
                      <Link to="/kehadiran" className="hover:text-green-500">
                        Kehadiran
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/pengguna/${user.id}`}
                        className="hover:text-green-500"
                      >
                        Profile
                      </Link>
                    </li>
                  </>
                )}
                {user.role === 'stu' && (
                  <>
                    <li>
                      <Link to="/siswa" className="hover:text-green-500">
                        Siswa
                      </Link>
                    </li>
                    <li>
                      <Link to="/kelas" className="hover:text-green-500">
                        Kelas
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/pengguna/${user.id}`}
                        className="hover:text-green-500"
                      >
                        Profile
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <li>
                <Link to="/pengguna/login" className="hover:text-green-500">
                  Signin
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleDarkMode}
            className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <select
            value={language}
            onChange={handleLanguageChange}
            className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
