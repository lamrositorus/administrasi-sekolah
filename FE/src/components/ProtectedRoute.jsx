import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { roles } from '../global/Role'; // Pastikan path ini sesuai dengan struktur proyek Anda

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Ambil informasi pengguna dari context

  // Cek apakah pengguna terautentikasi dan memiliki akses ke rute
  if (
    !user ||
    !roles[user.role]?.canAccess.includes(window.location.pathname)
  ) {
    return <Navigate to="/pengguna/login" />;
  }

  return children; // Jika terautentikasi, render anak komponen
};

export default ProtectedRoute;
