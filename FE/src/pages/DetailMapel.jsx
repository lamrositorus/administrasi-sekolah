import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importing useParams and useNavigate from react-router-dom
import { API_Source } from '../global/Apisource'; // Importing the API source
import { FaTrash, FaEdit, FaBook, FaCalendarAlt } from 'react-icons/fa'; // Importing icons from react-icons
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const DetailMapel = ({ isDarkMode, language }) => {
  const { id } = useParams(); // Get the subject ID from the URL parameters
  const navigate = useNavigate(); // Hook to navigate after deletion

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSubjectName, setNewSubjectName] = useState(''); // State for updating subject name
  const [subjects, setSubjects] = useState([]); // State to hold the list of subjects

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const data = await API_Source.getSubjectById(id);
        setSubject(data); // Set the fetched subject data
        setNewSubjectName(data.subjectname); // Initialize the subject name for editing
      } catch (error) {
        setError('Failed to fetch subject: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await API_Source.getSubjects(); // Fetch all subjects
        setSubjects(data); // Set the subjects data in state
      } catch (error) {
        setError('Failed to fetch subjects: ' + error.message);
      }
    };

    fetchSubject();
    fetchSubjects(); // Call fetchSubjects to get the list of subjects
  }, [id]); // Dependency array includes id to refetch if it changes

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to delete this subject.' : 'Anda akan menghapus mata pelajaran ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, delete it!' : 'Ya, hapus!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await API_Source.deleteSubject(id);
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Deleted!' : 'Dihapus!',
          text: language === 'en' ? 'The subject has been deleted.' : 'Mata pelajaran telah dihapus.',
        });
        navigate('/mataPelajaran'); // Redirect to the subject list
      } catch (error) {
        setError('Failed to delete subject: ' + error.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to update this subject.' : 'Anda akan memperbarui mata pelajaran ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, update it!' : 'Ya, perbarui!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const updatedSubject = await API_Source.updateSubject(id, newSubjectName);
        setSubject(updatedSubject); // Update the subject state with the new data
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Updated!' : 'Diperbarui!',
          text: language === 'en' ? 'The subject has been updated successfully!' : 'Mata pelajaran telah diperbarui dengan sukses!',
        });
      } catch (error) {
        setError('Failed to update subject: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!subject) {
    return <div>{language === 'en' ? 'No subject found.' : 'Tidak ada mata pelajaran ditemukan.'}</div>;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}>
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaBook className="inline-block mr-2" />
        {language === 'en' ? 'Subject Details' : 'Detail Mata Pelajaran'}
      </motion.h1>
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <motion.table
          className="min-w-full border border-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b font-medium text-left">
                <FaBook className="inline-block mr-1" />
                {language === 'en' ? 'ID:' : 'ID:'}
              </td>
              <td className="py-2 px-4 border-b text-left">{subject.subjectid}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-medium text-left">
                <FaEdit className="inline-block mr-1" />
                {language === 'en' ? 'Name:' : 'Nama:'}
              </td>
              <td className="py-2 px-4 border-b text-left">{subject.subjectname}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-medium text-left">
                <FaCalendarAlt className="inline-block mr-1" />
                {language === 'en' ? 'Created At:' : 'Dibuat Pada:'}
              </td>
              <td className="py-2 px-4 border-b text-left">
                {new Date(subject.createdat).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-medium text-left">
                <FaCalendarAlt className="inline-block mr-1" />
                {language === 'en' ? 'Updated At:' : 'Diperbarui Pada:'}
              </td>
              <td className="py-2 px-4 border-b text-left">
                {new Date(subject.updatedat).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </motion.table>

        <form onSubmit={handleUpdate} className="mt-4">
          <label className="block mb-2 font-medium">{language === 'en' ? 'Update Subject Name:' : 'Perbarui Nama Mata Pelajaran:'}</label>
          <select
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)} // Update newSubjectName state on change
            required
            className={`border rounded p-2 mb-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          >
            {subjects.map((subjectItem) => (
              <option
                key={subjectItem.subjectid}
                value={subjectItem.subjectname}
              >
                {subjectItem.subjectname} {/* Display the subject name */}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 ${isDarkMode ? 'hover:bg-blue-400' : ''}`}
          >
            <FaEdit className="mr-2" /> {language === 'en' ? 'Update Subject' : 'Perbarui Mata Pelajaran'}
          </button>
        </form>

        <button
          onClick={handleDelete}
          className={`flex items-center bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200 mt-4 ${isDarkMode ? 'hover:bg-red-500' : ''}`}
        >
          <FaTrash className="mr-2" /> {language === 'en' ? 'Delete Subject' : 'Hapus Mata Pelajaran'}
        </button>
      </div>
    </div>
  );
};

export default DetailMapel;