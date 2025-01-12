const express = require('express');
const router = express.Router();
const db = require('../connection');
const responsePayload = require('../response');

// GET /dashboard
router.get('/', (req, res) => {
  // Mengambil data statistik dari berbagai tabel
  const stats = {};

  // Menghitung jumlah siswa
  db.query(
    'SELECT COUNT(*) AS totalstudents FROM students',
    (error, results) => {
      if (error) {
        return responsePayload(
          500,
          'Terjadi kesalahan saat mengambil data siswa',
          null,
          res
        );
      }
      stats.totalStudents = results.rows[0].totalstudents; // Accessing the correct property

      // Menghitung jumlah guru
      db.query(
        'SELECT COUNT(*) AS totalteachers FROM teachers',
        (error, results) => {
          if (error) {
            return responsePayload(
              500,
              'Terjadi kesalahan saat mengambil data guru',
              null,
              res
            );
          }
          stats.totalTeachers = results.rows[0].totalteachers; // Accessing the correct property

          // Menghitung jumlah kelas
          db.query(
            'SELECT COUNT(*) AS totalclasses FROM classes',
            (error, results) => {
              if (error) {
                return responsePayload(
                  500,
                  'Terjadi kesalahan saat mengambil data kelas',
                  null,
                  res
                );
              }
              stats.totalClasses = results.rows[0].totalclasses; // Accessing the correct property

              // Menghitung jumlah mata pelajaran
              db.query(
                'SELECT COUNT(*) AS totalsubjects FROM subjects',
                (error, results) => {
                  if (error) {
                    return responsePayload(
                      500,
                      'Terjadi kesalahan saat mengambil data mata pelajaran',
                      null,
                      res
                    );
                  }
                  stats.totalSubjects = results.rows[0].totalsubjects; // Accessing the correct property

                  // Mengembalikan semua statistik
                  return responsePayload(
                    200,
                    'Data dashboard berhasil diambil',
                    stats,
                    res
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
