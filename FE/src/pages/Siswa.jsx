import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserGraduate } from 'react-icons/fa';

export const Siswa = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [classid, setClassId] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await API_Source.getStudents();
        setStudents(data);
      } catch (err) {
        setError('Failed to fetch students: ' + err.message);
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

    fetchStudents();
    fetchClasses();
  }, []);

  const handleAddStudent = async (event) => {
    event.preventDefault();
    try {
      const newStudent = await API_Source.postStudent(name, age, classid);
      setStudents((prevStudents) => [...prevStudents, newStudent]);
      setName('');
      setAge('');
      setClassId('');
    } catch (err) {
      setError('Failed to add student: ' + err.message);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Create a mapping of class IDs to class names
  const classMap = {};
  classes.forEach((classItem) => {
    classMap[classItem.classid] = classItem.classname;
  });

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-6">Student List</h1>
      <form onSubmit={handleAddStudent} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium">
              Student Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaUserPlus className="w-5 h-5 text-gray-400 ml-2" />
              <input
                type="text"
                id="name"
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="age" className="block text-sm font-medium">
              Age
            </label>
            <input
              type="number"
              id="age"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="classid" className="block text-sm font-medium">
              Class
            </label>
            <select
              id="classid"
              value={classid}
              onChange={(e) => setClassId(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((classItem) => (
                <option key={classItem.classid} value={classItem.classid}>
                  {classItem.classname}
                </option>
              ))}
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          <FaUserGraduate className="inline-block mr-2" /> Add Student
        </button>
      </form>
      {students.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">NIM</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Age</th>
              <th className="py-2 px-4 border-b">Class</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentid} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{student.studentid}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`${student.studentid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student.name}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{student.age}</td>
                <td className="py-2 px-4 border-b">
                  {classMap[student.classid] || 'Unknown Class'}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(student.createdat).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(student.updatedat).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No students found.</p>
      )}
    </div>
  );
};

export default Siswa;
