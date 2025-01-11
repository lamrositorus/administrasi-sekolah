const express = require('express')
const router = express.Router()
const db = require('../connection')
const responsePayload = require('../response')
const { v4: uuidv4 } = require('uuid') // Import the v4 function from uuid

// GET /mataPelajaran
router.get('/', (req, res) => {
  db.query('SELECT * FROM subjects', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data mata pelajaran',
        null,
        res,
      )
    }
    const payload = results.rows // Ambil semua baris
    return responsePayload(
      200,
      'Data mata pelajaran berhasil diambil',
      payload,
      res,
    )
  })
})

// GET /mataPelajaran/:id
router.get('/:id', (req, res) => {
  const { id } = req.params
  db.query(
    'SELECT * FROM subjects WHERE subjectid = $1', // Gunakan parameterized query
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data mata pelajaran',
          null,
          res,
        )
      }
      if (results.rows.length === 0) {
        return responsePayload(
          404,
          'Data mata pelajaran tidak ditemukan',
          null,
          res,
        )
      }
      const payload = results.rows[0] // Ambil baris pertama
      return responsePayload(
        200,
        'Data mata pelajaran berhasil diambil',
        payload,
        res,
      )
    },
  )
})

// POST /mataPelajaran
router.post('/', (req, res) => {
  const data = req.body
  const id = uuidv4() // Gunakan uuidv4 untuk menghasilkan ID unik
  if (!Object.keys(data).length) {
    return responsePayload(400, 'Data tidak ditemukan', null, res)
  }

  // Menambahkan createdat dan updatedat
  const created_at = new Date().toISOString()
  const updated_at = created_at

  db.query(
    'INSERT INTO subjects (subjectid, subjectname, createdat, updatedat) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, data.subjectname, created_at, updated_at],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menyimpan data mata pelajaran',
          null,
          res,
        )
      }
      const payload = results.rows[0] // Ambil baris yang dimasukkan
      return responsePayload(
        200,
        'Data mata pelajaran berhasil disimpan',
        payload,
        res,
      )
    },
  )
})

// PUT /mataPelajaran/:id
router.put('/:id', (req, res) => {
  const { id } = req.params
  const data = req.body
  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res)
  }

  const updated_at = new Date().toISOString()
  db.query(
    'UPDATE subjects SET subjectname = $1, updatedat = $2 WHERE subjectid = $3 RETURNING *',
    [data.subjectname, updated_at, id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat memperbarui data mata pelajaran',
          null,
          res,
        )
      }
      const payload = results.rows[0] // Ambil baris yang diperbarui
      return responsePayload(
        200,
        'Data mata pelajaran berhasil diperbarui',
        payload,
        res,
      )
    },
  )
})

// DELETE /mataPelajaran/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res)
  }
  db.query(
    'DELETE FROM subjects WHERE subjectid = $1 RETURNING *',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data mata pelajaran',
          null,
          res,
        )
      }
      if (results.rowCount === 0) {
        return responsePayload(
          404,
          'Data mata pelajaran tidak ditemukan',
          null,
          res,
        )
      }
      const payload = results.rows[0] // Ambil baris yang dihapus
      return responsePayload(
        200,
        'Data mata pelajaran berhasil dihapus',
        payload,
        res,
      )
    },
  )
})

module.exports = router
