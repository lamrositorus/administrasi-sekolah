import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { API_Source } from '../global/Apisource'; // Importing the API source
import { FaTrash, FaEdit, FaBook, FaArrowLeft, FaIdCard, FaUser , FaChalkboardTeacher, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa'; // Importing icons from react-icons
import { motion } from 'framer-motion'; // Import Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const DetailKehadiran = ({ isDarkMode, language }) => {
  const { id } = useParams(); // Get the attendance ID from the URL parameters
  const navigate = useNavigate(); // Initialize navigate
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentid, setStudentId] = useState('');
  const [classid, setClassId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [students, setStudents] = useState([]); // State to hold the list of students
  const [classes, setClasses] = useState([]); // State to hold the list of classes
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await API_Source.getAttendanceById(id);
        setAttendanceData(data);
        setStudentId(data.studentid);
        setClassId(data.classid);
        setDate(data.date);
        setStatus(data.status);
      } catch (err) {
        setError('Failed to fetch attendance: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        const data = await API_Source.getStudents(); // Fetch all students
        setStudents(data); // Set the students data in state
      } catch (err) {
        setError('Failed to fetch students: ' + err.message);
      }
    };

    const fetchClasses = async () => {
      try {
        const data = await API_Source.getClasses(); // Fetch all classes
        setClasses(data); // Set the classes data in state
      } catch (err) {
        setError('Failed to fetch classes: ' + err.message);
      }
    };

    fetchAttendance();
    fetchStudents(); // Fetch students
    fetchClasses(); // Fetch classes
  }, [id]);

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
        await API_Source.deleteAttendance(id);
        Swal.fire(
          language === 'en' ? 'Deleted!' : 'Dihapus!',
          language === 'en' ? 'Attendance record has been deleted.' : 'Rekaman kehadiran telah dihapus.',
          'success'
        );
        navigate('/kehadiran'); // Redirect to the attendance list
      } catch (err) {
        Swal.fire(
          language === 'en' ? 'Error!' : 'Kesalahan!',
          language === 'en' ? 'Error deleting attendance: ' + err.message : 'Kesalahan saat menghapus kehadiran: ' + err.message,
          'error'
        );
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to update this attendance record.' : 'Anda akan memperbarui rekaman kehadiran ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, update it!' : 'Ya, perbarui!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await API_Source.updateAttendance(id, studentid, classid, date, status);
        Swal.fire(
          language === 'en' ? 'Updated!' : 'Diperbarui!',
          language === 'en' ? 'Attendance updated successfully!' : 'Kehadiran berhasil diperbarui!',
          'success'
        );
        setIsEditing(false); // Exit editing mode
      } catch (err) {
        Swal.fire(
          language === 'en' ? 'Error!' : 'Kesalahan!',
          language === 'en' ? 'Error updating attendance: ' + err.message : 'Kesalahan saat memperbarui kehadiran: ' + err.message,
          'error'
        );
      }
    }
  };

  if (loading) {
    return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-left">
        <FaBook className="inline-block mr-2" />
        {language === 'en' ? 'Attendance Details' : 'Detail Kehadiran'}
      </h1>
      {attendanceData && (
        <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <div className="flex justify-between mb-4">
            <button
              onClick={() => navigate(-1)} // Navigate to the previous page
              className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-200"
            >
              <FaArrowLeft className="inline-block mr-1" /> Previous
            </button>
          </div>
          <table className="min-w-full text-left border border-gray-300">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  <FaIdCard className="inline-block mr-1" /> Attendance ID:
                </td>
                <td className="py-2 px-4 border-b">
                  {attendanceData.attendanceid}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  <FaUser  className="inline-block mr-1" /> Student:
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={studentid}
                    onChange={(e) => setStudentId(e.target.value)} // Update studentid state on change
                    disabled={!isEditing} // Disable if not in editing mode
                    required
                    className={`border rounded p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  >
                    {students.map((student) => (
                      <option key={student.studentid} value={student.studentid}>
                        {student.name} {/* Display the student's name */}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  <FaChalkboardTeacher className="inline-block mr-1" /> Class:
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={classid}
                    onChange={(e) => setClassId(e.target.value)} // Update classid state on change
                    disabled={!isEditing} // Disable if not in editing mode
                    required
                    className={`border rounded p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  >
                    {classes.map((classItem) => (
                      <option key={classItem .classid} value={classItem.classid}>
                        {classItem.classname} {/* Display the class name */}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  <FaCalendarAlt className="inline-block mr-1" /> Date:
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!isEditing} // Disable if not in editing mode
                    required
                    className={`border rounded p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  <FaCheckCircle className="inline-block mr-1" /> Status:
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!isEditing} // Disable if not in editing mode
                    required
                    className={`border rounded p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  <FaClock className="inline-block mr-1" /> Created At:
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(attendanceData.createdat).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  <FaClock className="inline-block mr-1" /> Updated At:
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(attendanceData.updatedat).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                <FaEdit className="inline mr-1" /> Update Attendance
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
              >
                <FaEdit className="inline mr-1" /> Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
            >
              <FaTrash className="inline mr-1" /> Delete Attendance
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DetailKehadiran;