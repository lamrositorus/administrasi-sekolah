import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaPlus, FaUser , FaCalendarAlt } from 'react-icons/fa'; // Import icons from react-icons
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const Guru = ({ isDarkMode, language }) => {
  const [teachers, setTeachers] = useState([]); // State to hold the list of teachers
  const [subjects, setSubjects] = useState([]); // State to hold the list of subjects
  const [error, setError] = useState(''); // State to hold any error messages
  const [name, setName] = useState(''); // State for the new teacher's name
  const [subjectid, setSubjectId] = useState(''); // State for the new teacher's subject ID

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await API_Source.getTeachers(); // Fetch teacher data
        console.log('Data Guru: ', data);
        setTeachers(data); // Set the teachers data in state
      } catch (err) {
        setError('Failed to fetch teachers: ' + err.message); // Handle error
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await API_Source.getSubjects(); // Fetch subject data
        setSubjects(data); // Set the subjects data in state
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message); // Handle error
      }
    };

    fetchTeachers();
    fetchSubjects(); // Fetch subjects when the component mounts
  }, []); // Run effect only once when the component mounts

  const handleAddTeacher = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Konfirmasi menggunakan SweetAlert
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to add a new teacher.' : 'Anda akan menambahkan guru baru.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, add it!' : 'Ya, tambahkan!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const newTeacher = await API_Source.postTeacher(name, subjectid); // Post new teacher data
        setTeachers((prevTeachers) => [...prevTeachers, newTeacher]); // Update the teachers list with the new teacher
        setName(''); // Clear the name input
        setSubjectId(''); // Clear the subject ID input

        // Tampilkan notifikasi sukses
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Teacher Added' : 'Guru Ditambahkan',
          text: language === 'en' ? 'The teacher has been added successfully!' : 'Guru telah ditambahkan dengan sukses!',
        });
      } catch (err) {
        setError('Failed to add teacher: ' + err.message); // Handle error
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} min-h-screen`}>
      <motion.h1
        className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaChalkboardTeacher className="inline-block mr-2" />
        {language === 'en' ? 'Teacher List' : 'Daftar Guru'}
      </motion.h1>
      <form onSubmit={handleAddTeacher} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <FaUser  className="inline-block mr-1" />
              {language === 'en' ? 'Teacher Name' : 'Nama Guru'}
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <input
                type="text"
                id="name"
                placeholder={language === 'en' ? 'Enter teacher name' : 'Masukkan nama guru'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="subjectid" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <FaChalkboardTeacher className="inline-block mr-1" />
              {language === 'en' ? 'Subject' : 'Mata Pelajaran'}
            </label>
            <select
              id="subjectid"
              value={subjectid}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            >
              <option value="">{language === 'en' ? 'Select Subject' : 'Pilih Mata Pelajaran'}</option>
              {subjects.map((subject) => (
                <option key={subject.subjectid} value={subject.subjectid}>
                  {subject.subjectname}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className={`mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 ${isDarkMode ? 'hover:bg-blue-500' : ''}`}
        >
          <FaPlus className="inline-block mr-2" />
          {language === 'en' ? 'Add Teacher' : 'Tambah Guru'}
        </button>
      </form>
      {teachers.length > 0 ? (
        <motion.table
          className={`min-w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Name' : 'Nama'}</th>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Subject' : 'Mata Pelajaran'}</th>
              <th className="py-2 px-4 border-b">{language === 'en' ? 'Created At' : 'Dibuat Pada'}</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => {
              const subject = subjects.find(
                (sub) => sub.subjectid === teacher.subjectid
              );
              return (
                <motion.tr
                  key={teacher.teacherid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/guru/${teacher.teacherid}`}
                      className="text-blue-600 hover:underline"
                    >
                      {teacher.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {subject ? subject.subjectname : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <FaCalendarAlt className="inline-block mr-1" />
                    {new Date(teacher.createdat).toLocaleString()}
                  </ td>
                </motion.tr>
              );
            })}
          </tbody>
        </motion.table>
      ) : (
        <p className={`text-gray-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>{language === 'en' ? 'No teachers found.' : 'Tidak ada guru ditemukan.'}</p>
      )}
    </div>
  );
};

export default Guru;