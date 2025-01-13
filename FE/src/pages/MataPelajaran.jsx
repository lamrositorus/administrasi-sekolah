import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaPlus, FaBook, FaCalendarAlt } from 'react-icons/fa'; // Import icons from react-icons
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const MataPelajaran = ({ isDarkMode, language }) => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [subjectname, setNewSubjectName] = useState(''); // State for new subject name

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await API_Source.getSubjects();
        setSubjects(response); // Set subjects directly from the response
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []); // Empty dependency array to run only once on mount

  const handleAddSubject = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Konfirmasi menggunakan SweetAlert
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to add a new subject.' : 'Anda akan menambahkan mata pelajaran baru.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, add it!' : 'Ya, tambahkan!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const data = await API_Source.postSubject(subjectname);
        setSubjects((prevSubjects) => [...prevSubjects, data]); // Add the new subject to the list
        setNewSubjectName(''); // Clear the input field

        // Tampilkan notifikasi sukses
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Subject Added' : 'Mata Pelajaran Ditambahkan',
          text: language === 'en' ? 'The subject has been added successfully!' : 'Mata pelajaran telah ditambahkan dengan sukses!',
        });
      } catch (err) {
        setError('Failed to add subject: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}>
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaBook className="inline-block mr-2" />
        {language === 'en' ? 'Subjects' : 'Mata Pelajaran'}
      </motion.h1>
      <form onSubmit={handleAddSubject} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={subjectname}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder={language === 'en' ? 'Enter new subject name' : 'Masukkan nama mata pelajaran baru'}
            required
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? ' bg-gray-700 text-white' : 'bg-white text-black'}`}
          />
          <button
            type="submit"
            className={`ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center ${isDarkMode ? 'hover:bg-blue-500' : ''}`}
          >
            <FaPlus className="mr-1" /> {language === 'en' ? 'Add Subject' : 'Tambah Mata Pelajaran'}
          </button>
        </div>
      </form>
      {subjects.length > 0 ? (
        <motion.table
          className={`min-w-full border border-gray-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr>
              <th className={`py-2 px-4 border-b ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <FaBook className="inline-block mr-1" />
                {language === 'en' ? 'Subject Name' : 'Nama Mata Pelajaran'}
              </th>
              <th className={`py-2 px-4 border-b ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <FaCalendarAlt className="inline-block mr-1" />
                {language === 'en' ? 'Created At' : 'Dibuat Pada'}
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.subjectid} className={`hover:bg-gray-400 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <td className="py-2 px-4 border-b text-left">
                  <Link
                    to={`${subject.subjectid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {subject.subjectname}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(subject.createdat).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <p className="text-gray-500">{language === 'en' ? 'No subjects found.' : 'Tidak ada mata pelajaran ditemukan.'}</p>
      )}
    </div>
  );
};

export default MataPelajaran;