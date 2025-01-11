const express = require('express')
const router = express.Router()
const db = require('../connection')
const responsePayload = require('../response')

// GET /siswa
router.get('/', (req, res) => {
  db.query('SELECT * FROM students', (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat mengambil data siswa',
        null,
        res,
      )
    }
    const payload = results.rows // Extract only the rows
    return responsePayload(200, 'Data siswa berhasil diambil', payload, res)
  })
})

// GET /siswa/:id
router.get('/:id', (req, res) => {
  const { id } = req.params
  db.query(
    'SELECT * FROM students WHERE StudentID = $1', // Use parameterized query
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data siswa',
          null,
          res,
        )
      }
      if (results.rows.length === 0) {
        return responsePayload(404, 'Data siswa tidak ditemukan', null, res)
      }
      const payload = results.rows[0] // Get the first row
      return responsePayload(200, 'Data siswa berhasil diambil', payload, res)
    },
  )
})

// POST /siswa
router.post('/', (req, res) => {
  const data = req.body
  const id = Math.floor(Math.random() * 1000000) // Generate a random ID
  const created_at = new Date().toISOString()
  const updated_at = created_at

  console.log(data)

  // Memeriksa apakah data yang diperlukan ada
  if (!data.name || !data.age || !data.classid) {
    return responsePayload(400, 'Data tidak lengkap', null, res)
  }

  // Memperbaiki query SQL untuk menyertakan createdat dan updatedat
  const query =
    'INSERT INTO students (studentid, name, age, classid, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING studentid'
  const values = [id, data.name, data.age, data.classid, created_at, updated_at]

  db.query(query, values, (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat menyimpan data siswa',
        null,
        res,
      )
    }
    const payload = results.rows[0] // Mendapatkan baris yang dimasukkan
    return responsePayload(200, 'Data siswa berhasil disimpan', payload, res)
  })
})

// PUT /siswa/:id
router.put('/:id', (req, res) => {
  const { id } = req.params
  const data = req.body

  if (!id || !Object.keys(data).length) {
    return responsePayload(400, 'ID atau data tidak ditemukan', null, res)
  }

  // Build the dynamic query
  const fields = []
  const values = []
  let index = 1

  if (data.name) {
    fields.push(`name = $${index++}`)
    values.push(data.name)
  }
  if (data.age) {
    fields.push(`age = $${index++}`)
    values.push(data.age)
  }
  if (data.classid) {
    fields.push(`classid = $${index++}`)
    values.push(data.classid)
  }
  const updated_at = new Date().toISOString()
  fields.push(`updatedat = $${index++}`)
  values.push(updated_at)

  if (fields.length === 0) {
    return responsePayload(400, 'Tidak ada data yang diperbarui', null, res)
  }

  const query = `UPDATE students SET ${fields.join(', ')} WHERE StudentID = $${index} RETURNING *`
  values.push(id)

  db.query(query, values, (error, results) => {
    if (error) {
      return responsePayload(
        500,
        'Terjadi kesalahan saat memperbarui data siswa',
        null,
        res,
      )
    }
    const payload = results.rows[0] // Get the updated row
    return responsePayload(200, 'Data siswa berhasil diperbarui', payload, res)
  })
})

// DELETE /siswa/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params
  if (!id) {
    return responsePayload(400, 'ID tidak ditemukan', null, res)
  }

  db.query(
    'DELETE FROM students WHERE studentid = $1',
    [id],
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat menghapus data siswa',
          null,
          res,
        )
      }

      // Jika tidak ada baris yang terpengaruh, berarti ID tidak ditemukan
      if (results.rowCount === 0) {
        return responsePayload(404, 'Data siswa tidak ditemukan', null, res)
      }

      // Jika penghapusan berhasil
      return responsePayload(200, 'Data siswa berhasil dihapus', null, res)
    },
  )
})

module.exports = router
