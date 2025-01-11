const express = require('express')
const router = express.Router()
const db = require('../connection')
const responsePayload = require('../response')

// GET /kelas
router.get('/', (req, res) => {
  db.query('SELECT * FROM classes', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data kelas',
        null,
        res,
      )
    }
    const payload = results.rows // Ambil semua baris
    return responsePayload(
      200,
      'Data kelas berhasil diambil',
      { data: payload },
      res,
    )
  })
})

// GET /kelas/:id
router.get('/:id', (req, res) => {
  const { id } = req.params
  db.query(
    'SELECT * FROM classes WHERE classid = $1', // Gunakan parameterized query
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data kelas',
          null,
          res,
        )
      }
      if (results.rows.length === 0) {
        return responsePayload(404, 'Data kelas tidak ditemukan', null, res)
      }
      const payload = results.rows[0] // Ambil baris pertama
      return responsePayload(
        200,
        'Data kelas berhasil diambil',
        { data: payload },
        res,
      )
    },
  )
})

// POST /kelas
router.post('/', (req, res) => {
  const data = req.body
  if (!Object.keys(data).length) {
    return responsePayload(400, 'Data tidak ditemukan', null, res)
  }

  // Menambahkan createdat dan updatedat
  const created_at = new Date().toISOString()
  const updated_at = created_at

  db.query(
    'INSERT INTO classes (classname, createdat, updatedat) VALUES ($1, $2, $3) RETURNING *',
    [data.classname, created_at, updated_at],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menyimpan data kelas',
          null,
          res,
        )
      }
      const payload = results.rows[0] // Ambil baris yang dimasukkan
      return responsePayload(
        200,
        'Data kelas berhasil disimpan',
        { data: payload },
        res,
      )
    },
  )
})

// PUT /kelas/:id
router.put('/:id', (req, res) => {
  const { id } = req.params
  const data = req.body
  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res)
  }

  const updated_at = new Date().toISOString()
  db.query(
    'UPDATE classes SET classname = $1, updatedat = $2 WHERE classid = $3 RETURNING *',
    [data.classname, updated_at, id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat memperbarui data kelas',
          null,
          res,
        )
      }
      const payload = results.rows[0] // Ambil baris yang diperbarui
      return responsePayload(
        200,
        'Data kelas berhasil diperbarui',
        { data: payload },
        res,
      )
    },
  )
})

// DELETE /kelas/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res)
  }
  db.query(
    'DELETE FROM classes WHERE classid = $1 RETURNING *',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data kelas',
          null,
          res,
        )
      }
      if (results.rowCount === 0) {
        return responsePayload(404, 'Data kelas tidak ditemukan', null, res)
      }
      const payload = results.rows[0] // Ambil baris yang dihapus
      return responsePayload(
        200,
        'Data kelas berhasil dihapus',
        { data: payload },
        res,
      )
    },
  )
})

module.exports = router
