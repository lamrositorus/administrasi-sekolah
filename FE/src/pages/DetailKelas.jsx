import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource'; // Importing the API source
import { useParams, useNavigate } from 'react-router-dom'; // Importing useParams and useNavigate from react-router-dom
import { FaTrash, FaEdit, FaBook, FaCalendarAlt } from 'react-icons/fa'; // Importing icons from react-icons
import { motion } from 'framer-motion'; // Import Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const DetailKelas = ({ isDarkMode, language }) => {
  const { id } = useParams(); // Accessing the class ID parameter from the URL
  const [classDetails, setClassDetails] = useState(null); // State to hold class details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages
  const [classname, setClassname] = useState(''); // State to manage the class name for updates
  const [classes, setClasses] = useState([]); // State to hold the list of classes
  const navigate = useNavigate(); // Hook to navigate after deletion

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const data = await API_Source.getClassesById(id); // Fetch class details using the API
        setClassDetails(data); // Set the fetched class details in state
        setClassname(data.classname); // Initialize classname state with fetched data
      } catch (error) {
        setError(error.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchClasses = async () => {
      try {
        const data = await API_Source.getClasses(); // Fetch all classes
        setClasses(data); // Set the classes data in state
      } catch (error) {
        setError(error.message); // Set error message if fetching fails
      }
    };

    fetchClassDetails(); // Call the function to fetch class details
    fetchClasses(); // Call the function to fetch all classes
  }, [id]); // Dependency array includes id to refetch if it changes

  // Function to handle class deletion
  const handleDelete = async () => {
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
        await API_Source.deleteClass(id); // Call the deleteClass method
        Swal.fire(
          language === 'en' ? 'Deleted!' : 'Dihapus!',
          language === 'en' ? 'Class has been deleted.' : 'Kelas telah dihapus.',
          'success'
        );
        navigate('/kelas'); // Redirect to the class list
      } catch (error) {
        setError('Failed to delete class: ' + error.message); // Set error message if deletion fails
      }
    }
  };

  // Function to handle class update
  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to update this class.' : 'Anda akan memperbarui kelas ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, update it!' : 'Ya, perbarui!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await API_Source.updateClass(id, classname); // Call the updateClass method
        Swal.fire(
          language === 'en' ? 'Updated!' : 'Diperbarui!',
          language === 'en' ? 'Class has been updated .' : 'Kelas telah diperbarui.',
          'success'
        );
        setClassDetails((prev) => ({ ...prev, classname })); // Update the class details in state
      } catch (error) {
        setError('Failed to update class: ' + error.message); // Set error message if update fails
      }
    }
  };

  // Render loading state
  if (loading) return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;

  // Render error state
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Render class details if available
  return (
    <motion.div
      className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6">
        <FaBook className="inline-block mr-2" />
        {language === 'en' ? 'Class Details' : 'Detail Kelas'}
      </h1>
      {classDetails ? (
        <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <table className="min-w-full border border-gray-300">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaBook className="inline-block mr-1" />
                  {language === 'en' ? 'Class ID:' : 'ID Kelas:'}
                </td>
                <td className="py-2 px-4 border-b text-left">{classDetails.classid}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaEdit className="inline-block mr-1" />
                  {language === 'en' ? 'Class Name:' : 'Nama Kelas:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  <select
                    value={classname}
                    onChange={(e) => setClassname(e.target.value)} // Update classname state on select change
                    className={`border rounded p-1 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  >
                    {classes.map((classItem) => (
                      <option key={classItem.classid} value={classItem.classname}>
                        {classItem.classname} {/* Display the class name */}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaCalendarAlt className="inline-block mr-1" />
                  {language === 'en' ? 'Created At:' : 'Dibuat Pada:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(classDetails.createdat).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaCalendarAlt className="inline-block mr-1" />
                  {language === 'en' ? 'Updated At:' : 'Diperbarui Pada:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(classDetails.updatedat).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleUpdate}
              className={`flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 ${isDarkMode ? 'hover:bg-blue-400' : ''}`}
            >
              <FaEdit className="mr-2" /> {language === 'en' ? 'Update Class' : 'Perbarui Kelas'}
            </button>
            <button
              onClick={handleDelete}
              className={`flex items-center bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200 ${isDarkMode ? 'hover:bg-red-500' : ''}`}
            >
              <FaTrash className="mr-2" /> {language === 'en' ? 'Delete Class' : 'Hapus Kelas'}
            </button>
          </div>
        </div>
      ) : (
        <p>{language === 'en' ? 'No class details available.' : 'Detail kelas tidak tersedia.'}</p>
      )}
    </motion.div>
  );
};

export default DetailKelas;