const express = require('express');
const router = express.Router();
const db = require('../connection');
const responsePayload = require('../response');
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from uuid

// GET /guru
router.get('/', (req, res) => {
  db.query('SELECT * FROM teachers', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data guru',
        null,
        res
      );
    }
    const payload = results.rows; // Ambil semua baris
    return responsePayload(
      200,
      'Data guru berhasil diambil',
      { data: payload },
      res
    );
  });
});

// GET /guru/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM teachers WHERE teacherid = $1', // Gunakan parameterized query
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data guru',
          null,
          res
        );
      }
      if (results.rows.length === 0) {
        return responsePayload(404, 'Data guru tidak ditemukan', null, res);
      }
      const payload = results.rows[0]; // Ambil baris pertama
      return responsePayload(
        200,
        'Data guru berhasil diambil',
        { data: payload },
        res
      );
    }
  );
});

// POST /guru
router.post('/', (req, res) => {
  const data = req.body;
  const id = uuidv4(); // Gunakan uuidv4 untuk menghasilkan ID unik
  // Periksa apakah data yang diperlukan ada
  if (!data || !data.name || !data.subjectid) {
    return responsePayload(400, 'Data tidak lengkap', null, res);
  }

  // Siapkan query dan nilai
  const query =
    'INSERT INTO teachers (teacherid, name, subjectid, createdat, updatedat) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [
    id,
    data.name,
    data.subjectid,
    new Date().toISOString(),
    new Date().toISOString(),
  ];

  // Eksekusi query
  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error); // Log kesalahan untuk debugging
      return responsePayload(
        500,
        'Terjadi kesalahan saat menyimpan data guru',
        null,
        res
      );
    }

    const payload = results.rows[0]; // Ambil baris yang dimasukkan
    return responsePayload(
      200,
      'Data guru berhasil disimpan',
      { data: payload },
      res
    );
  });
});

// PUT /guru/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Periksa ID dan data
  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res);
  }

  const fields = [];
  const values = [];
  let index = 1;

  // Bangun query dinamis
  if (data.name) {
    fields.push(`name = $${index++}`);
    values.push(data.name);
  }
  if (data.subjectid) {
    fields.push(`subjectid = $${index++}`);
    values.push(data.subjectid);
  }

  if (fields.length === 0) {
    return responsePayload(400, 'Tidak ada data yang diperbarui', null, res);
  }

  const updated_at = new Date().toISOString();
  fields.push(`updatedat = $${index}`); // Tambahkan updatedat ke query
  values.push(updated_at);

  const query = `UPDATE teachers SET ${fields.join(', ')} WHERE teacherid = $${index + 1} RETURNING *`;
  values.push(id); // Tambahkan ID setelah updatedat

  // Eksekusi query
  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error); // Log kesalahan untuk debugging
      return responsePayload(
        500,
        'Terjadi kesalahan saat memperbarui data guru',
        null,
        res
      );
    }

    const payload = results.rows[0]; // Ambil baris yang diperbarui
    return responsePayload(
      200,
      'Data guru berhasil diperbarui',
      { data: payload },
      res
    );
  });
});

// DELETE /guru/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res);
  }
  db.query(
    'DELETE FROM teachers WHERE teacherid = $1',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data guru',
          null,
          res
        );
      }
      return responsePayload(200, 'Data guru berhasil dihapus', null, res);
    }
  );
});

module.exports = router;
