import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaPlus, FaBook, FaCalendarAlt } from 'react-icons/fa'; // Import icons from react-icons
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const Kelas = ({ isDarkMode, language }) => {
  const [classes, setClasses] = useState([]); // State to hold class data
  const [error, setError] = useState(''); // State to hold error messages
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [classname, setClassname] = useState(''); // State to hold new class name
  const [successMessage, setSuccessMessage] = useState(''); // State to hold success messages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await API_Source.getClasses(); // Fetch class data
        setClasses(data); // Set class data in state
      } catch (err) {
        setError('Failed to fetch classes: ' + err.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchClasses();
  }, []); // Run effect only once when the component mounts

  const handleCreateClass = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const data = await API_Source.createClass(classname); // Call createClass function
      setClasses((prevClasses) => [...prevClasses, data]); // Update class list with new class
      setSuccessMessage(`Class "${classname}" created successfully!`); // Set success message
      setClassname(''); // Clear input field
      navigate('/kelas'); // Navigate to the class list page
    } catch (err) {
      setError('Failed to create class: ' + err.message); // Handle error
    }
  };

  const handleDeleteClass = async (classId) => {
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You won\'t be able to revert this!' : 'Anda tidak akan dapat mengembalikannya!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, delete it!' : 'Ya, hapus!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await API_Source.deleteClass(classId); // Call the delete method
        setClasses((prevClasses) => prevClasses.filter((classItem) => classItem.classid !== classId)); // Remove deleted class from state
        Swal.fire(
          language === 'en' ? 'Deleted!' : 'Dihapus!',
          language === 'en' ? 'Class has been deleted.' : 'Kelas telah dihapus.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          language === 'en' ? 'Error!' : 'Kesalahan!',
          language === 'en' ? 'Failed to delete class: ' + err.message : 'Gagal menghapus kelas: ' + err.message,
          'error'
        );
      }
    }
  };

  if (loading) {
    return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading classes...</div>; // Show loading state
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  return (
    <motion.div
      className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold text center mb-6">
        <FaBook className="inline-block mr-2" />
        {language === 'en' ? 'Class List' : 'Daftar Kelas'}
      </h1>
      <form onSubmit={handleCreateClass} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            id="classname"
            value={classname}
            onChange={(e) => setClassname(e.target.value)} // Update state on input change
            required
            placeholder={language === 'en' ? 'Enter new class name' : 'Masukkan nama kelas baru'}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          />
          <button
            type="submit"
            className={`ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center ${isDarkMode ? 'hover:bg-blue-500' : ''}`}
          >
            <FaPlus className="mr-1" /> {language === 'en' ? 'Create Class' : 'Buat Kelas'}
          </button>
        </div>
      </form>
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )} {/* Display success message */}
      {classes.length > 0 ? (
        <table className={`min-w-full border border-gray-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <thead>
            <tr>
              <th className={`py-2 px-4 border-b ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <FaBook className="inline-block mr-1" />
                {language === 'en' ? 'Class Name' : 'Nama Kelas'}
              </th>
              <th className={`py-2 px-4 border-b ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <FaCalendarAlt className="inline-block mr-1" />
                {language === 'en' ? 'Created At' : 'Dibuat Pada'}
              </th>
              
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.classid} className={`hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-600' : ''}`}>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`${classItem.classid}`}
                    className={`text-blue-600 hover:underline ${isDarkMode ? 'text-blue-400' : ''}`}
                  >
                    {classItem.classname}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(classItem.createdat).toLocaleString()}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={`text-gray-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>{language === 'en' ? 'No classes found.' : 'Tidak ada kelas ditemukan.'}</p>
      )}
    </motion.div>
  );
};

export default Kelas;