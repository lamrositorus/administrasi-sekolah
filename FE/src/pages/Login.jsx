import React, { useState } from "react";
import { API_Source } from "../global/Apisource";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/AuthContext'; // Import useAuth untuk mengakses konteks

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State untuk menyimpan pesan error
  const navigate = useNavigate();
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await API_Source.login(username, password); // Panggil fungsi login
      console.log("data: ", data);

      // Simpan data pengguna (userid, role, dll.) setelah login berhasil
      const user = {
        userId: data.userid, // Ambil userId dari data
        username: data.username,
        role: data.role,
        // Tambahkan properti lain jika diperlukan
      };
      login(user); // Panggil fungsi login dari AuthContext untuk menyimpan data pengguna

      navigate("/dashboard"); // Redirect ke halaman dashboard
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your username and password."); // Tampilkan pesan error
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Tampilkan pesan error jika ada */}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};