import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaChalkboardTeacher, FaUser , FaUniversity, FaCalendarAlt } from 'react-icons/fa'; // Import icons from react-icons
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const Kehadiran = ({ isDarkMode, language }) => {
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]); // State for students
  const [classes, setClasses] = useState([]); // State for classes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAttendance, setNewAttendance] = useState({
    studentid: '',
    classid: '',
    date: '',
    status: '',
  });

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await API_Source.getAttendances();
        setAttendances(response.data);
      } catch (err) {
        setError('Failed to fetch attendances: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await API_Source.getStudents(); // Fetch students
        setStudents(response); // Adjust based on your API response structure
      } catch (err) {
        setError('Failed to fetch students: ' + err.message);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await API_Source.getClasses(); // Fetch classes
        setClasses(response); // Adjust based on your API response structure
      } catch (err) {
        setError('Failed to fetch classes: ' + err.message);
      }
    };

    fetchAttendances();
    fetchStudents();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Konfirmasi menggunakan SweetAlert
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to add a new attendance record.' : 'Anda akan menambahkan catatan kehadiran baru.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, add it!' : 'Ya, tambahkan!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const addedAttendance = await API_Source.postAttendance(
          newAttendance.studentid,
          newAttendance.classid,
          newAttendance.date,
          newAttendance.status
        );
        setAttendances((prev) => [...prev, addedAttendance]);
        setNewAttendance({ studentid: '', classid: '', date: '', status: '' });
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Attendance Added' : 'Kehadiran Ditambahkan',
          text: language === 'en' ? 'The attendance has been added successfully!' : 'Kehadiran telah ditambahkan dengan sukses!',
        });
      } catch (err) {
        setError('Failed to add attendance: ' + err.message);
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
        className="text-3 ```javascript
        xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaChalkboardTeacher className="inline-block mr-2" />
        {language === 'en' ? 'Attendance' : 'Kehadiran'}
      </motion.h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="studentid" className="block text-sm font-medium">
              <FaUser  className="inline-block mr-1" />
              {language === 'en' ? 'Select Student' : 'Pilih Siswa'}
            </label>
            <select
              name="studentid"
              value={newAttendance.studentid}
              onChange={handleChange}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.studentid} value={student.studentid}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="classid" className="block text-sm font-medium">
              <FaUniversity className="inline-block mr-1" />
              {language === 'en' ? 'Select Class' : 'Pilih Kelas'}
            </label>
            <select
              name="classid"
              value={newAttendance.classid}
              onChange={handleChange}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="">Select Class</option>
              {classes.map((classItem) => (
                <option key={classItem.classid} value={classItem.classid}>
                  {classItem.classname}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="date" className="block text-sm font-medium">
            <FaCalendarAlt className="inline-block mr-1" />
            {language === 'en' ? 'Date' : 'Tanggal'}
          </label>
          <input
            type="datetime-local"
            name="date"
            value={newAttendance.date}
            onChange={handleChange}
            required
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="status" className="block text-sm font-medium">
            <FaUser  className="inline-block mr-1" />
            {language === 'en' ? 'Status' : 'Status'}
          </label>
          <select
            name="status"
            value={newAttendance.status}
            onChange={handleChange}
            required
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          >
            <option value="">{language === 'en' ? 'Select Status' : 'Pilih Status'}</option>
            <option value="present">{language === 'en' ? 'Present' : 'Hadir'}</option>
            <option value="absent">{language === 'en' ? 'Absent' : 'Tidak Hadir'}</option>
            <option value="late">{language === 'en' ? 'Late' : 'Terlambat'}</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaUserPlus className="mr-2" /> {language === 'en' ? 'Add Attendance' : 'Tambah Kehadiran '}
        
        </button>
      </form>
      <motion.table
        className={`min-w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-300`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">{language === 'en' ? 'Name' : 'Nama'}</th>
            <th className="py-2 px-4 border-b">{language === 'en' ? 'Class ID' : 'ID Kelas'}</th>
            <th className="py-2 px-4 border-b">{language === 'en' ? 'Date' : 'Tanggal'}</th>
            <th className="py-2 px-4 border-b">{language === 'en' ? 'Status' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance) => {
            const student = students.find(
              (s) => s.studentid === attendance.studentid
            ); // Find student by ID
            return (
              <tr key={attendance.attendanceid}>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`${attendance.attendanceid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student ? student.name : attendance.studentid}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{attendance.classid}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(attendance.date).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">{attendance.status}</td>
              </tr>
            );
          })}
        </tbody>
      </motion.table>
    </div>
  );
};