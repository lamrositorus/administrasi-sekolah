import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Mengambil nilai dari localStorage saat inisialisasi
    return localStorage.getItem('darkMode') === 'true';
  });
  const [language, setLanguage] = useState(() => {
    // Mengambil nilai dari localStorage saat inisialisasi
    return localStorage.getItem('language') || 'en';
  });

  const logout = () => {
    setUser(null);
    // Tambahkan logika logout lainnya jika diperlukan
  };

  // Menyimpan preferensi ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isDarkMode,
        setIsDarkMode,
        language,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
