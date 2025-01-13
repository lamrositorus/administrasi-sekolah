import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_Source } from '../global/Apisource';
import { FaUserEdit, FaTrash, FaUser , FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const DetailSiswa = ({ isDarkMode, language }) => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [classid, setClassid] = useState('');
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await API_Source.getStudentById(id);
        setStudentData(data);
        setName(data.name);
        setAge(data.age);
        setClassid(data.classid);
      } catch (err) {
        setError('Failed to fetch student data: ' + err.message);
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

    fetchStudentData();
    fetchClasses();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to update this student.' : 'Anda akan memperbarui siswa ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, update it!' : 'Ya, perbarui!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const updatedData = await API_Source.updateStudent(id, name, age, classid);
        setStudentData(updatedData);
        setIsEditing(false);
        Swal.fire(
          language === 'en' ? 'Updated!' : 'Diperbarui!',
          language === 'en' ? 'Student data has been updated.' : 'Data siswa telah diperbarui.',
          'success'
        );
      } catch (err) {
        setError('Failed to update student data: ' + err.message);
      }
    }
  };

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
        await API_Source.deleteStudent(id);
        Swal.fire(
          language === 'en' ? 'Deleted!' : 'Dihapus!',
          language === 'en' ? 'Student has been deleted.' : 'Siswa telah dihapus.',
          'success'
        );
        navigate('/siswa');
      } catch (err) {
        setError('Failed to delete student: ' + err.message);
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const className =
    classes.find((classItem) => classItem.classid === classid)?.classname ||
    'Unknown Class';

  return (
    <motion.div
      className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        <FaUser  className="inline-block mr-2" />
        {language === 'en' ? 'Student Details' : 'Detail Siswa'}
      </h1>
      {studentData ? (
        <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaUser  className="inline-block mr-1" />
                  {language === 'en' ? 'Name:' : 'Nama:'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaUser  className="inline-block mr-1" />
                  {language === 'en' ? 'Age:' : 'Usia:'}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaChalkboardTeacher className="inline-block mr-1" />
                  {language === 'en' ? 'Class:' : 'Kelas:'}
                </label>
                <select
                  value={classid}
                  onChange={(e) => setClassid(e.target.value)}
                  required
                  className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                >
                  {classes.map((classItem) => (
                    <option key={classItem.classid} value={classItem.classid}>
                      {classItem.classname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className={`bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 ${isDarkMode ? 'hover:bg-blue-500' : ''}`}
                >
                  {language === 'en' ? 'Update Student' : 'Perbarui Siswa'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 transition duration-200 ${isDarkMode ? 'hover:bg-gray-300' : ''}`}
                >
                  {language === 'en' ? 'Cancel' : 'Batal'}
                </button>
              </div>
            </form>
          ) : (
            <table className={`min-w-full border border-gray-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-left">
                    <FaUser  className="inline-block mr-1" />
                    {language === 'en' ? 'Student ID:' : 'ID Siswa:'}
                  </td>
                  <td className="py-2 px-4 text-left">{studentData.studentid}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-left">
                    <FaUser  className="inline-block mr-1" />
                    {language === 'en' ? 'Name:' : 'Nama:'}
                  </td>
                  <td className="py-2 px-4 text-left">{studentData.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-left">
                    <FaUser  className="inline-block mr-1" />
                    {language === 'en' ? 'Age:' : 'Usia:'}
                  </td>
                  <td className="py-2 px-4 text-left">{studentData.age}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-left">
                    <FaChalkboardTeacher className="inline-block mr-1" />
                    {language === 'en' ? 'Class:' : 'Kelas:'}
                  </td>
                  <td className="py-2 px-4 text-left">{className}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-left">
                    <FaCalendarAlt className="inline-block mr-1" />
                    {language === 'en' ? 'Created At:' : 'Dibuat Pada:'}
                  </td>
                  <td className="py-2 px-4 text-left">
                    {new Date(studentData.createdat).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-left">
                    <FaCalendarAlt className="inline-block mr-1" />
                    {language === 'en' ? 'Updated At:' : 'Diperbarui Pada:'}
                  </td>
                  <td className="py-2 px-4 text-left">
                    {new Date(studentData.updatedat).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          <div className="mt-4 flex justify-between">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200 ${isDarkMode ? 'hover:bg-yellow-400' : ''}`}
                >
                  <FaUserEdit  className="inline-block mr-1" />
                  {language === 'en' ? 'Edit Student' : 'Edit Siswa'}
                </button>
                <button
                  onClick={handleDelete}
                  className={`bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200 ${isDarkMode ? 'hover:bg-red-500' : ''}`}
                >
                  <FaTrash className="inline-block mr-1" />
                  {language === 'en' ? 'Delete Student' : 'Hapus Siswa'}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className={`text-gray-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>{language === 'en' ? 'Loading...' : 'Memuat...'}</p>
      )}
    </motion.div>
  );
};

export default DetailSiswa;