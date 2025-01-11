import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Import useAuth untuk mendapatkan informasi pengguna
const id = localStorage.getItem('userId');
console.log(id);
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Ambil informasi pengguna dari context

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="text-black py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard App</h1>
        <button
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 focus:outline-none"
          onClick={toggleMenu}
        >
          <span className={`block w-8 h-1 bg-black mb-1 transition-transform duration-300 ${isOpen ? 'transform rotate-45 translate-y-1' : ''}`}></span>
          <span className={`block w-8 h-1 bg-black mb-1 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-8 h-1 bg-black transition-transform duration-300 ${isOpen ? 'transform -rotate-45 -translate-y-1' : ''}`}></span>
        </button>
        <nav className={`md:flex ${isOpen ? 'block mt-9' : 'hidden'} absolute md:static bg-white md:bg-transparent w-full md:w-auto top-16 left-0`}>
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0">
            <li><Link to="/dashboard" className="hover:text-green-500">Dashboard</Link></li>
            {user && user.role === 'adm' && (
              <>
                <li><Link to="/siswa" className="hover:text-green-500">Siswa</Link></li>
                <li><Link to="/guru" className="hover:text-green-500">Guru</Link></li>
                <li><Link to="/kelas" className="hover:text-green-500">Kelas</Link></li>
                <li><Link to="/mataPelajaran" className="hover:text-green-500">Mata Pelajaran</Link></li>
                <li><Link to="/transaksiKeuangan" className="hover:text-green-500">Transaksi Keuangan</Link></li>
                <li><Link to="/kehadiran" className="hover:text-green-500">Kehadiran</Link></li>
              </>
            )}
            {user && user.role === 'tea' && (
              <>
                <li><Link to="/siswa" className="hover:text-green-500">Siswa</Link></li>
                <li><Link to="/kelas" className="hover:text-green-500">Kelas</Link></li>
                <li><Link to="/mataPelajaran" className="hover:text-green-500">Mata Pelajaran</Link></li>
                <li><Link to="/kehadiran" className="hover:text-green-500">Kehadiran</Link></li>
              </>
            )}
            {user && user.role === 'stu' && (
              <>
                <li><Link to="/siswa" className="hover:text-green-500">Siswa</Link></li>
                <li><Link to="/kelas" className="hover:text-green-500">Kelas</Link></li>
              </>
            )}
            <li><Link to={`/pengguna/${id}`} className="hover:text-green-500">Profil</Link></li>
            <li><Link to="/pengguna" className="hover:text-green-500">Signup</Link></li>
            <li><Link to="/pengguna/login" className="hover:text -green-500">Signin</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;