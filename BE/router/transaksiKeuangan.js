const express = require('express');
const router = express.Router();
const db = require('../connection');
const responsePayload = require('../response');
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from uuid
// GET /transaksiKeuangan
router.get('/', (req, res) => {
  db.query('SELECT * FROM financialtransactions', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data transaksi keuangan',
        null,
        res
      );
    }
    const payload = results.rows; // Get all rows
    return responsePayload(
      200,
      'Data transaksi berhasil diambil',
      payload,
      res
    );
  });
});

// GET /transaksiKeuangan/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM financialtransactions WHERE TransactionID = $1',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data transaksi keuangan',
          null,
          res
        );
      }
      if (results.rows.length === 0) {
        return responsePayload(
          404,
          'Data transaksi keuangan tidak ditemukan',
          null,
          res
        );
      }
      const payload = results.rows[0]; // Get the first row
      return responsePayload(
        200,
        'Data transaksi berhasil diambil',
        payload,
        res
      );
    }
  );
});

// POST /transaksiKeuangan
router.post('/', (req, res) => {
  try {
    const id = uuidv4(); // Generate a new UUID
    const data = req.body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    // Check for required fields
    if (!data.studentid || !data.amount || !data.transactiondate) {
      return responsePayload(400, 'Data tidak lengkap', null, res); // 400 Bad Request
    }

    // Validate amount
    if (data.amount <= 0) {
      return responsePayload(
        400,
        'Jumlah harus lebih besar dari nol',
        null,
        res
      ); // 400 Bad Request
    }

    // Prepare the query and values
    const query =
      'INSERT INTO financialtransactions (transactionid, studentid, amount, transactiondate, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING transactionid';
    const values = [
      id,
      data.studentid,
      data.amount,
      data.transactiondate,
      created_at,
      updated_at,
    ];

    // Execute the query
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Database error on insert:', error); // Log the error for debugging
        if (error.code === '23503') {
          // Foreign key violation
          return responsePayload(
            404,
            'Student ID tidak valid. Pastikan siswa ada di tabel students.',
            null,
            res
          ); // 404 Not Found
        }
        return responsePayload(
          500,
          'Terjadi kesalahan saat menyimpan data transaksi keuangan',
          null,
          res
        ); // 500 Internal Server Error
      }

      // Get the inserted row
      const payload = results.rows[0];
      return responsePayload(
        201,
        'Data transaksi keuangan berhasil disimpan',
        payload,
        res
      ); // 201 Created
    });
  } catch (error) {
    console.error('Unexpected error:', error.message); // Log the error for debugging
    return responsePayload(
      500,
      'Terjadi kesalahan yang tidak terduga',
      null,
      res
    ); // 500 Internal Server Error
  }
});

// PUT /transaksiKeuangan/:id
router.put('/:id', (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL
  const data = req.body; // Mengambil data dari body permintaan

  // Memeriksa apakah ID dan data yang diperlukan ada
  if (!data.amount || !data.transactiondate) {
    return responsePayload(400, 'ID atau data tidak lengkap', null, res);
  }

  const fields = [];
  const values = [];
  let index = 1;

  // Menyiapkan field untuk diperbarui

  if (data.amount) {
    fields.push(`amount = $${index++}`);
    values.push(data.amount);
  }
  if (data.transactiondate) {
    fields.push(`transactiondate = $${index++}`);
    values.push(data.transactiondate);
  }

  // Menambahkan updatedat
  const updated_at = new Date().toISOString();
  fields.push(`updatedat = $${index++}`);
  values.push(updated_at);

  // Memastikan setidaknya satu field diperbarui
  if (fields.length === 0) {
    return responsePayload(400, 'Tidak ada data yang diperbarui', null, res);
  }

  // Menyiapkan query untuk memperbarui data
  const query = `UPDATE financialtransactions SET ${fields.join(', ')} WHERE transactionid = $${index} RETURNING *`;
  values.push(id); // Menambahkan ID ke dalam values untuk query

  // Menjalankan query
  db.query(query, values, (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat memperbarui data transaksi keuangan',
        null,
        res
      );
    }
    const payload = results.rows[0]; // Mendapatkan baris yang diperbarui
    return responsePayload(
      200,
      'Data transaksi keuangan berhasil diperbarui',
      payload,
      res
    );
  });
});

// DELETE /transaksiKeuangan/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res);
  }
  db.query(
    'DELETE FROM financialtransactions WHERE TransactionID = $1',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data transaksi keuangan',
          null,
          res
        );
      }
      const payload = results.rows[0]; // Get the deleted row
      return responsePayload(
        200,
        'Data transaksi keuangan berhasil dihapus',
        payload,
        res
      );
    }
  );
});

module.exports = router;
