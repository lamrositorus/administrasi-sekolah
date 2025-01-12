const express = require('express');
const router = express.Router();
const db = require('../connection');
const responsePayload = require('../response');
const { v4: uuidv4 } = require('uuid');

function generateRandomIntegerId() {
  // Menghasilkan angka acak antara 10000000 dan 99999999 (8 digit)
  return Math.floor(10000000 + Math.random() * 90000000);
}

// GET /siswa
router.get('/', (req, res) => {
  db.query('SELECT * FROM students', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data siswa',
        null,
        res
      );
    }
    const payload = results.rows; // Extract only the rows
    return responsePayload(200, 'Data siswa berhasil diambil', payload, res);
  });
});

// GET /siswa/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM students WHERE StudentID = $1', // Use parameterized query
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data siswa',
          null,
          res
        );
      }
      if (results.rows.length === 0) {
        return responsePayload(404, 'Data siswa tidak ditemukan', null, res);
      }
      const payload = results.rows[0]; // Get the first row
      return responsePayload(200, 'Data siswa berhasil diambil', payload, res);
    }
  );
});

// POST /siswa

router.post('/', (req, res) => {
  const data = req.body;
  const id = generateRandomIntegerId(); // Menghasilkan ID acak dalam bentuk integer
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  // Memeriksa apakah data yang diperlukan ada
  if (!data.name || !data.age || !data.classid) {
    return responsePayload(400, 'Data tidak lengkap', null, res); // 400 Bad Request
  }

  // Validasi usia
  if (data.age < 0) {
    return responsePayload(400, 'Usia tidak boleh negatif', null, res); // 400 Bad Request
  }

  // Validasi classid
  const checkClassQuery = 'SELECT * FROM public.classes WHERE classid = $1';
  db.query(checkClassQuery, [data.classid], (error, results) => {
    if (error) {
      console.error('Database error on class check:', error);
      return responsePayload(
        500,
        'Terjadi kesalahan saat memeriksa kelas',
        null,
        res
      ); // 500 Internal Server Error
    }
    if (results.rows.length === 0) {
      return responsePayload(
        404,
        'classid tidak valid. Pastikan kelas ada di tabel classes.',
        null,
        res
      ); // 404 Not Found
    }

    // Jika classid valid, lanjutkan dengan insert
    const query =
      'INSERT INTO students (studentid, name, age, classid, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING studentid';
    const values = [
      id,
      data.name,
      data.age,
      data.classid,
      created_at,
      updated_at,
    ];
    console.log('Query:', query);
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Database error on insert:', error);
        if (error.code === '23505') {
          // Duplicate key violation
          return responsePayload(409, 'Data siswa sudah ada', null, res); // 409 Conflict
        }
        return responsePayload(
          500,
          'Terjadi kesalahan saat menyimpan data siswa',
          null,
          res
        ); // 500 Internal Server Error
      }
      const payload = results.rows[0]; // Mendapatkan baris yang dimasukkan
      return responsePayload(201, 'Data siswa berhasil disimpan', payload, res); // 201 Created
    });
  });
});

// PUT /siswa/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res);
  }

  // Build the dynamic query
  const fields = [];
  const values = [];
  let index = 1;

  if (data.name) {
    fields.push(`name = $${index++}`);
    values.push(data.name);
  }
  if (data.age) {
    fields.push(`age = $${index++}`);
    values.push(data.age);
  }
  if (data.classid) {
    fields.push(`classid = $${index++}`);
    values.push(data.classid);
  }
  const updated_at = new Date().toISOString();
  fields.push(`updatedat = $${index++}`);
  values.push(updated_at);

  if (fields.length === 0) {
    return responsePayload(400, 'Tidak ada data yang diperbarui', null, res);
  }

  const query = `UPDATE students SET ${fields.join(', ')} WHERE StudentID = $${index} RETURNING *`;
  values.push(id);

  db.query(query, values, (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat memperbarui data siswa',
        null,
        res
      );
    }
    const payload = results.rows[0]; // Get the updated row
    return responsePayload(200, 'Data siswa berhasil diperbarui', payload, res);
  });
});

// DELETE /siswa/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Memeriksa apakah ID disediakan
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res); // Bad Request
  }

  // Memeriksa apakah siswa ada sebelum mencoba menghapus
  db.query(
    'SELECT * FROM students WHERE studentid = $1',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error checking student existence:', error);
        return responsePayload(
          500,
          'Terjadi kesalahan saat memeriksa data siswa',
          null,
          res // Internal Server Error
        );
      }

      // Jika tidak ada baris yang ditemukan, siswa tidak ada
      if (results.rowCount === 0) {
        return responsePayload(404, 'Data siswa tidak ditemukan', null, res); // Not Found
      }

      // Melanjutkan untuk menghapus siswa
      db.query(
        'DELETE FROM students WHERE studentid = $1',
        [id],
        (error, results) => {
          if (error) {
            console.error('Error deleting student:', error);
            return responsePayload(
              500,
              'Terjadi kesalahan saat menghapus data siswa',
              null,
              res // Internal Server Error
            );
          }
          // Jika ada data terkait, tolak penghapusan
          if (results.rowCount > 0) {
            return responsePayload(
              409,
              'Tidak dapat menghapus siswa karena ada data terkait',
              null,
              res
            ); // Conflict
          }
          // Jika penghapusan berhasil
          return responsePayload(200, 'Data siswa berhasil dihapus', null, res); // OK
        }
      );
    }
  );
});

module.exports = router;
