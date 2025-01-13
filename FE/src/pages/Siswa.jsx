import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserGraduate, FaUsers, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const Siswa = ({ isDarkMode, language }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [classid, setClassId] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await API_Source.getStudents();
        setStudents(data);
      } catch (err) {
        setError('Failed to fetch students: ' + err.message);
      }
    };

    const fetchClasses = async () => {
      try {
        const data = await API_Source.getClasses();
        setClasses(data);
      } catch (err) {
        setError('Failed to fetch classes: ' + err.message);
      }
    };

    fetchStudents();
    fetchClasses();
  }, []);

  const handleAddStudent = async (event) => {
    event.preventDefault();

    // Konfirmasi menggunakan SweetAlert
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to add a new student.' : 'Anda akan menambahkan siswa baru.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, add it!' : 'Ya, tambahkan!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const newStudent = await API_Source.postStudent(name, age, classid);
        setStudents((prevStudents) => [...prevStudents, newStudent]);
        setName('');
        setAge('');
        setClassId('');

        // Tampilkan notifikasi sukses
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Student Added' : 'Siswa Ditambahkan',
          text: language === 'en' ? 'The student has been added successfully!' : 'Siswa telah ditambahkan dengan sukses!',
        });
      } catch (err) {
        setError('Failed to add student: ' + err.message);
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Create a mapping of class IDs to class names
  const classMap = {};
  classes.forEach((classItem) => {
    classMap[classItem.classid] = classItem.classname;
  });

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} min-h-screen`}>
      <motion.h1
        className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaUsers className="inline-block mr-2" />
        {language === 'en' ? 'Student List' : 'Daftar Siswa'}
      </motion.h1>
      <form onSubmit={handleAddStudent} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black' }`}>
              <FaUserPlus className="inline-block mr-1" />
              {language === 'en' ? 'Student Name' : 'Nama Siswa'}
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <input
                type="text"
                id="name"
                placeholder={language === 'en' ? 'Enter student name' : 'Masukkan nama siswa'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="age" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <FaUserGraduate className="inline-block mr-1" />
              {language === 'en' ? 'Age' : 'Usia'}
            </label>
            <input
              type="number"
              id="age"
              placeholder={language === 'en' ? 'Enter age' : 'Masukkan usia'}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className={`block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="classid" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <FaChalkboardTeacher className="inline-block mr-1" />
              {language === 'en' ? 'Class' : 'Kelas'}
            </label>
            <select
              id="classid"
              value={classid}
              onChange={(e) => setClassId(e.target.value)}
              required
              className={`block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            >
              <option value="">{language === 'en' ? 'Select Class' : 'Pilih Kelas'}</option>
              {classes.map((classItem) => (
                <option key={classItem.classid} value={classItem.classid}>
                  {classItem.classname}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className={`mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 ${isDarkMode ? 'hover:bg-blue-500' : ''}`}
        >
          <FaUserGraduate className="inline-block mr-2" /> {language === 'en' ? 'Add Student' : 'Tambah Siswa'}
        </button>
      </form>
      {students.length > 0 ? (
        <motion.table
          className={`min-w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'NIM' : 'NIM'}</th>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Name' : 'Nama'}</th>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Age' : 'Usia'}</th>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Class' : 'Kelas'}</th>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Created At' : 'Dibuat Pada'}</th>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Updated At' : 'Diperbarui Pada'}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <motion.tr
                key={student.studentid}
                className={`${isDarkMode ? ' bg-gray-800' : 'bg-white'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td className="py-2 px-4 border-b">{student.studentid}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`${student.studentid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student.name}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{student.age}</td>
                <td className="py-2 px-4 border-b">
                  {classMap[student.classid] || (language === 'en' ? 'Unknown Class' : 'Kelas Tidak Dikenal')}
                </td>
                <td className="py-2 px-4 border-b">
                  <FaCalendarAlt className="inline-block mr-1" />
                  {new Date(student.createdat).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <FaCalendarAlt className="inline-block mr-1" />
                  {new Date(student.updatedat).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <p className={`text-gray-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>{language === 'en' ? 'No students found.' : 'Tidak ada siswa ditemukan.'}</p>
      )}
    </div>
  );
};

export default Siswa;