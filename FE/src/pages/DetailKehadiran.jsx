import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { API_Source } from '../global/Apisource'; // Importing the API source
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importing icons from react-icons

export const DetailKehadiran = () => {
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
    if (
      window.confirm('Are you sure you want to delete this attendance record?')
    ) {
      try {
        await API_Source.deleteAttendance(id);
        alert('Attendance deleted successfully');
        navigate('/kehadiran'); // Redirect to the attendance list
      } catch (err) {
        alert('Error deleting attendance: ' + err.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await API_Source.updateAttendance(id, studentid, classid, date, status);
      alert('Attendance updated successfully');
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      alert('Error updating attendance: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detail Kehadiran</h1>
      {attendanceData && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => navigate(-1)} // Navigate to the previous page
              className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Previous
            </button>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-medium">
                  Attendance ID:
                </td>
                <td className="py-2 px-4 border-b">
                  {attendanceData.attendanceid}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Student:</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={studentid}
                    onChange={(e) => setStudentId(e.target.value)} // Update studentid state on change
                    disabled={!isEditing} // Disable if not in editing mode
                    required
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
                <td className="py-2 px-4 border-b font-medium">Class:</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={classid}
                    onChange={(e) => setClassId(e.target.value)} // Update classid state on change
                    disabled={!isEditing} // Disable if not in editing mode
                    required
                  >
                    {classes.map((classItem) => (
                      <option key={classItem.classid} value={classItem.classid}>
                        {classItem.classname} {/* Display the class name */}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Date:</td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!isEditing} // Disable if not in editing mode
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Status:</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!isEditing} // Disable if not in editing mode
                    required
                  >
                    <option value="present">Present</option>
                    <option value="absen">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Created At:</td>
                <td className="py-2 px-4 border-b">
                  {new Date(attendanceData.createdat).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Updated At:</td>
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
                Update Attendance
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
    </div>
  );
};
