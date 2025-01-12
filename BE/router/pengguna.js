const express = require('express');
const router = express.Router();
const db = require('../connection');
const responsePayload = require('../response');
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from uuid

// GET /pengguna
router.get('/', (req, res) => {
  db.query('SELECT * FROM public.users', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data pengguna',
        null,
        res
      );
    }
    const payload = results.rows; // Ambil semua baris
    return responsePayload(200, 'Data pengguna berhasil diambil', payload, res);
  });
});

// GET /pengguna/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM users WHERE userid = $1', // Gunakan parameterized query
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data pengguna',
          null,
          res
        );
      }
      if (results.rows.length === 0) {
        return responsePayload(404, 'Data pengguna tidak ditemukan', null, res);
      }
      const payload = results.rows[0]; // Ambil baris pertama
      return responsePayload(
        200,
        'Data pengguna berhasil diambil',
        payload,
        res
      );
    }
  );
});

// POST /pengguna/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return responsePayload(400, 'Username dan password harus diisi', null, res);
  }

  // Query untuk memeriksa pengguna
  db.query(
    'SELECT * FROM users WHERE username = $1 AND password = $2',
    [username, password],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat memproses login',
          null,
          res
        );
      }
      if (results.rows.length === 0) {
        return responsePayload(401, 'Username atau password salah', null, res);
      }
      const payload = results.rows[0]; // Ambil baris pengguna
      return responsePayload(200, 'Login berhasil', payload, res);
    }
  );
});

router.post('/', (req, res) => {
  const data = req.body;
  const id = uuidv4(); // Generate a UUID

  // Check if the request body is empty
  if (!Object.keys(data).length) {
    return responsePayload(400, 'Data tidak ditemukan', null, res);
  }

  // Check for required fields
  if (!data.username || !data.password || !data.role) {
    return responsePayload(
      400,
      'Username, password, and role are required',
      null,
      res
    );
  }

  // Check if the username already exists
  db.query(
    'SELECT * FROM users WHERE username = $1',
    [data.username],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat memeriksa username',
          null,
          res
        );
      }

      if (results.rows.length > 0) {
        return responsePayload(409, 'Username sudah terdaftar', null, res); // Conflict
      }

      // Insert the new user into the database
      db.query(
        'INSERT INTO users (userid, username, password, role, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          id,
          data.username,
          data.password,
          data.role,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
        (error, results) => {
          if (error) {
            return responsePayload(
              500,
              'Terjadi kesalahan saat menyimpan data pengguna',
              null,
              res
            );
          }
          const payload = results.rows[0]; // Ambil baris yang dimasukkan
          return responsePayload(
            201,
            'Data pengguna berhasil disimpan',
            payload,
            res
          ); // 201 Created
        }
      );
    }
  );
});

// PUT /pengguna/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res);
  }
  const updated_at = new Date().toISOString();
  db.query(
    'UPDATE users SET username = $1 , password = $2, role = $3, updatedat = $4 WHERE userid = $5 RETURNING *',
    [data.username, data.password, data.role, updated_at, id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat memperbarui data pengguna',
          null,
          res
        );
      }
      const payload = results.rows[0]; // Ambil baris yang diperbarui
      return responsePayload(
        200,
        'Data pengguna berhasil diperbarui',
        payload,
        res
      );
    }
  );
});

// DELETE /pengguna/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res);
  }
  db.query(
    'DELETE FROM users WHERE userid = $1 RETURNING *',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data pengguna',
          null,
          res
        );
      }
      if (results.rowCount === 0) {
        return responsePayload(404, 'Data pengguna tidak ditemukan', null, res);
      }
      const payload = results.rows[0]; // Ambil baris yang dihapus
      return responsePayload(
        200,
        'Data pengguna berhasil dihapus',
        payload,
        res
      );
    }
  );
});

module.exports = router;
