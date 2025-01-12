const express = require('express');
const router = express.Router();
const db = require('../connection');
const responsePayload = require('../response');
const { v4: uuidv4 } = require('uuid');

// GET /kehadiran
router.get('/', (req, res) => {
  db.query('SELECT * FROM attendance', (error, results) => {
    if (error) {
      console.error('Error fetching attendance data:', error);
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data kehadiran',
        null,
        res
      );
    }
    const payload = results.rows;
    return responsePayload(
      200,
      'Data kehadiran berhasil diambil',
      { data: payload },
      res
    );
  });
});

// GET /kehadiran/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM attendance WHERE attendanceid = $1',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error fetching attendance by ID:', error);
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data kehadiran',
          null,
          res
        );
      }
      if (results.rows.length === 0) {
        return responsePayload(
          404,
          'Data kehadiran tidak ditemukan',
          null,
          res
        );
      }
      const payload = results.rows[0];
      return responsePayload(
        200,
        'Data kehadiran berhasil diambil',
        { data: payload },
        res
      );
    }
  );
});

// POST /attendance
router.post('/', (req, res) => {
  const data = req.body;
  const id = uuidv4();
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  // Memeriksa apakah data yang diperlukan ada
  if (!data.studentid || !data.classid || !data.date || !data.status) {
    return responsePayload(400, 'Data tidak lengkap', null, res); // 400 Bad Request
  }
  console.log('Received status:', data.status); // Tambahkan ini untuk melihat nilai status

  // Validasi status
  const validStatuses = ['absen', 'present', 'late']; // Nilai yang valid
  if (!validStatuses.includes(data.status)) {
    return responsePayload(
      400,
      'Status tidak valid. Harus salah satu dari: absen, present, late',
      null,
      res
    ); // 400 Bad Request
  }

  const query =
    'INSERT INTO attendance (attendanceid, studentid, classid, date, status, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING attendanceid';
  const values = [
    id,
    data.studentid,
    data.classid,
    data.date,
    data.status,
    created_at,
    updated_at,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Database error on insert:', error);
      return responsePayload(
        500,
        'Terjadi kesalahan saat menyimpan data kehadiran',
        null,
        res
      ); // 500 Internal Server Error
    }
    const payload = results.rows[0]; // Mendapatkan baris yang dimasukkan
    return responsePayload(
      201,
      'Data kehadiran berhasil disimpan',
      payload,
      res
    ); // 201 Created
  });
});

// PUT /kehadiran/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res);
  }

  const updated_at = new Date().toISOString();
  db.query(
    'UPDATE attendance SET studentid = $1, classid = $2, date = $3, status = $4, updatedat = $5 WHERE attendanceid = $6 RETURNING *',
    [data.studentid, data.classid, data.date, data.status, updated_at, id],
    (error, results) => {
      if (error) {
        console.error('Database error on update:', error);
        return responsePayload(
          500,
          'Terjadi kesalahan saat memperbarui data kehadiran',
          null,
          res
        );
      }
      if (results.rows.length === 0) {
        return responsePayload(
          404,
          'Data kehadiran tidak ditemukan',
          null,
          res
        );
      }
      const payload = results.rows[0]; // Ambil baris yang diperbarui
      return responsePayload(
        200,
        'Data kehadiran berhasil diperbarui',
        { data: payload },
        res
      );
    }
  );
});

// DELETE /kehadiran/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res);
  }
  db.query(
    'DELETE FROM attendance WHERE attendanceid = $1 RETURNING *',
    [id],
    (error, results) => {
      if (error) {
        console.error('Database error on delete:', error);
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data kehadiran',
          null,
          res
        );
      }
      if (results.rowCount === 0) {
        return responsePayload(
          404,
          'Data kehadiran tidak ditemukan',
          null,
          res
        );
      }
      const payload = results.rows[0]; // Ambil baris yang dihapus
      return responsePayload(
        200,
        'Data kehadiran berhasil dihapus',
        { data: payload },
        res
      );
    }
  );
});

module.exports = router;
