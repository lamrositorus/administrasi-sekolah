const express = require('express')
const router = express.Router()
const db = require('../connection')
const responsePayload = require('../response')
const { v4: uuidv4 } = require('uuid') // Import the v4 function from uuid

// GET /kehadiran
router.get('/', (req, res) => {
  db.query('SELECT * FROM attendance', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data kehadiran',
        null,
        res,
      )
    }
    const payload = results.rows // Ambil semua baris
    return responsePayload(
      200,
      'Data kehadiran berhasil diambil',
      { data: payload },
      res,
    )
  })
})

// GET /kehadiran/:id
router.get('/:id', (req, res) => {
  const { id } = req.params
  db.query(
    'SELECT * FROM attendance WHERE attendanceid = $1', // Gunakan parameterized query
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data kehadiran',
          null,
          res,
        )
      }
      if (results.rows.length === 0) {
        return responsePayload(404, 'Data kehadiran tidak ditemukan', null, res)
      }
      const payload = results.rows[0] // Ambil baris pertama
      return responsePayload(
        200,
        'Data kehadiran berhasil diambil',
        { data: payload },
        res,
      )
    },
  )
})

// POST /kehadiran
router.post('/', (req, res) => {
  const data = req.body
  const id = uuidv4() // Gunakan uuidv4 untuk menghasilkan ID unik
  if (!Object.keys(data).length) {
    return responsePayload(400, 'Data tidak ditemukan', null, res)
  }

  db.query(
    'INSERT INTO attendance (attendanceid, studentid, classid, date, status, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [
      id,
      data.studentid,
      data.classid,
      data.date,
      data.status,
      new Date().toISOString(),
      new Date().toISOString(),
    ],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menyimpan data kehadiran',
          null,
          res,
        )
      }
      const payload = results.rows[0] // Ambil baris yang dimasukkan
      return responsePayload(
        200,
        'Data kehadiran berhasil disimpan',
        { data: payload },
        res,
      )
    },
  )
})

// PUT /kehadiran/:id
router.put('/:id', (req, res) => {
  const { id } = req.params
  const data = req.body
  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res)
  }

  const updated_at = new Date().toISOString()
  db.query(
    'UPDATE attendance SET studentid = $1, classid = $2, date = $3, status = $4, updatedat = $5 WHERE attendanceid = $6 RETURNING *',
    [data.studentid, data.classid, data.date, data.status, updated_at, id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat memperbarui data kehadiran',
          null,
          res,
        )
      }
      if (results.rows.length === 0) {
        return responsePayload(404, 'Data kehadiran tidak ditemukan', null, res)
      }
      const payload = results.rows[0] // Ambil baris yang diperbarui
      return responsePayload(
        200,
        'Data kehadiran berhasil diperbarui',
        { data: payload },
        res,
      )
    },
  )
})

// DELETE /kehadiran/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res)
  }
  db.query(
    'DELETE FROM attendance WHERE attendanceid = $1 RETURNING *',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data kehadiran',
          null,
          res,
        )
      }
      if (results.rowCount === 0) {
        return responsePayload(404, 'Data kehadiran tidak ditemukan', null, res)
      }
      const payload = results.rows[0] // Ambil baris yang dihapus
      return responsePayload(
        200,
        'Data kehadiran berhasil dihapus',
        { data: payload },
        res,
      )
    },
  )
})

module.exports = router
