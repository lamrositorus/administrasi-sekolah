import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_Source } from '../global/Apisource';
import { FaTrash, FaEdit, FaCalendarAlt, FaUser , FaBook } from 'react-icons/fa'; // Import icons from react-icons
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const DetailGuru = ({ isDarkMode, language }) => {
  const { id } = useParams();
  const [teacherData, setTeacherData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [subjectid, setSubjectId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const data = await API_Source.getTeacherById(id);
        setTeacherData(data);
        setName(data.name);
        setSubjectId(data.subjectid);
      } catch (err) {
        setError('Failed to fetch teacher data: ' + err.message);
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await API_Source.getSubjects();
        setSubjects(data);
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message);
      }
    };

    fetchTeacherData();
    fetchSubjects();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to update this teacher.' : 'Anda akan memperbarui data guru ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, update it!' : 'Ya, perbarui!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const updatedData = await API_Source.updateTeacher(id, name, subjectid);
        setTeacherData(updatedData);
        navigate('/guru');
        setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Updated!' : 'Diperbarui!',
          text: language === 'en' ? 'The teacher has been updated.' : 'Guru telah diperbarui.',
        });
      } catch (err) {
        setError('Failed to update teacher data: ' + err.message);
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to delete this teacher.' : 'Anda akan menghapus guru ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, delete it!' : 'Ya, hapus!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await API_Source.deleteTeacher(id);
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Deleted!' : 'Dihapus!',
          text: language === 'en' ? 'The teacher has been deleted.' : 'Guru telah dihapus.',
        });
        navigate('/guru');
      } catch (err) {
        setError('Failed to delete teacher: ' + err.message);
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const subjectName =
    subjects.find((subject) => subject.subjectid === teacherData?.subjectid)
      ?.subjectname || 'Unknown Subject';

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}>
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {language === 'en' ? 'Teacher Details' : 'Detail Guru'}
      </motion.h1>
      {teacherData ? (
        <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaUser  className="inline mr-2" /> Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`border rounded w-full py-2 px-3 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}
                  required
                />
              </div>
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaBook className="inline mr-2" /> Subject:
                </label>
                <select value={subjectid}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className={`border rounded w-full py-2 px-3 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}
                  required
                >
                  {subjects.map((subject) => (
                    <option key={subject.subjectid} value={subject.subjectid}>
                      {subject.subjectname}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Update Teacher
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="ml-2 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <motion.table
                className="min-w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <tbody>
                  <tr>
                    <td className={`py-2 px-4 border-b font-medium text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaUser   className="inline mr-2" /> Name:
                    </td>
                    <td className={`py-2 px-4 border-b text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{teacherData.name}</td>
                  </tr>
                  <tr>
                    <td className={`py-2 px-4 border-b font-medium text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaBook className="inline mr-2" /> Subject:
                    </td>
                    <td className={`py-2 px-4 border-b text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{subjectName}</td>
                  </tr>
                  <tr>
                    <td className={`py-2 px-4 border-b font-medium text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaCalendarAlt className="inline mr-2" /> Created At:
                    </td>
                    <td className={`py-2 px-4 border-b text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(teacherData.createdat).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className={`py-2 px-4 border-b font-medium text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaCalendarAlt className="inline mr-2" /> Updated At:
                    </td>
                    <td className={`py-2 px-4 border-b text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(teacherData.updatedat).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </motion.table>
              <div className="mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200"
                >
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ' text-gray-500'}`}>Loading...</p>
      )}
    </div>
  );
};

export default DetailGuru;