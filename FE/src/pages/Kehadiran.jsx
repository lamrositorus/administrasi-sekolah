import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaChalkboardTeacher } from 'react-icons/fa'; // Import ikon dari react-icons

export const Kehadiran = () => {
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
    try {
      const addedAttendance = await API_Source.postAttendance(
        newAttendance.studentid,
        newAttendance.classid,
        newAttendance.date,
        newAttendance.status
      );
      setAttendances((prev) => [...prev, addedAttendance]);
      setNewAttendance({ studentid: '', classid: '', date: '', status: '' });
    } catch (err) {
      setError('Failed to add attendance: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (attendances.length === 0) {
    return <div>No attendances found.</div>;
  }

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-6">Kehadiran</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="studentid" className="block text-sm font-medium">
              Select Student
            </label>
            <select
              name="studentid"
              value={newAttendance.studentid}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
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
              Select Class
            </label>
            <select
              name="classid"
              value={newAttendance.classid}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
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
            Date
          </label>
          <input
            type="datetime-local"
            name="date"
            value={newAttendance.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            name="status"
            value={newAttendance.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="present">Present</option>
            <option value="absen">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaUserPlus className="mr-2" /> Add Attendance
        </button>
      </form>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Class ID</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
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
      </table>
    </div>
  );
};
