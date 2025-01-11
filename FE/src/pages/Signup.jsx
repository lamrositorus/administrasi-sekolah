import React, { useState } from "react";
import { API_Source } from "../global/Apisource";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("stu"); // Default role diatur ke "stu"
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Panggil fungsi signup dengan data yang sesuai
      await API_Source.signup(username, password, role);
      // Setelah signup berhasil, redirect ke halaman login
      navigate("/pengguna/login");
    } catch (err) {
      setError(err.message); // Tampilkan pesan error ke pengguna
      console.error("Signup error:", err);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="stu">Siswa</option>
            <option value="tea">Guru</option>
            <option value="adm">Admin</option>
            {/* Tambahkan pilihan role lainnya di sini */}
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};