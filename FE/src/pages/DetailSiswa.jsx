import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_Source } from '../global/Apisource';
import { FaUserEdit, FaTrash } from 'react-icons/fa';

export const DetailSiswa = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [studentData, setStudentData] = useState(null); // State to hold student data
  const [error, setError] = useState(''); // State to hold any error messages
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
  const [name, setName] = useState(''); // State for student name
  const [age, setAge] = useState(''); // State for student age
  const [classid, setClassid] = useState(''); // State for student class ID
  const navigate = useNavigate(); // Hook to navigate after deletion
  const [classes, setClasses] = useState([]); // State to hold the list of classes

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await API_Source.getStudentById(id); // Fetch student data by ID
        setStudentData(data); // Set the student data in state
        setName(data.name); // Set initial values for editing
        setAge(data.age);
        setClassid(data.classid);
      } catch (err) {
        setError('Failed to fetch student data: ' + err.message); // Handle error
      }
    };

    const fetchClasses = async () => {
      try {
        const data = await API_Source.getClasses(); // Fetch class data
        setClasses(data); // Set the classes data in state
      } catch (err) {
        setError('Failed to fetch classes: ' + err.message); // Handle error
      }
    };

    fetchStudentData();
    fetchClasses(); // Call fetchClasses to get the list of classes
  }, [id]); // Run effect when ID changes

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const updatedData = await API_Source.updateStudent(
        id,
        name,
        age,
        classid
      ); // Update student data
      setStudentData(updatedData); // Update the student data in state
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setError('Failed to update student data: ' + err.message); // Handle error
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await API_Source.deleteStudent(id); // Call the delete method
        alert('Student deleted successfully.');
        navigate('/siswa'); // Redirect to the student list after deletion
      } catch (err) {
        setError('Failed to delete student: ' + err.message); // Handle error
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  // Find the class name based on classid
  const className =
    classes.find((classItem) => classItem.classid === classid)?.classname ||
    'Unknown Class';

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-6">Student Details</h1>
      {studentData ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Age:
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Class:
                </label>
                <select
                  value={classid}
                  onChange={(e) => setClassid(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                >
                  {classes.map((classItem) => (
                    <option key={classItem.classid} value={classItem.classid}>
                      {classItem.classname}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Update Student
              </button>
            </form>
          ) : (
            <table className="min-w-full bg-white border border-gray-300">
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">
                    Student ID:
                  </td>
                  <td className="py-2 px-4 border-b">
                    {studentData.studentid}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">Name:</td>
                  <td className="py-2 px-4 border-b">{studentData.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">Age:</td>
                  <td className="py-2 px-4 border-b">{studentData.age}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">Class:</td>
                  <td className="py-2 px-4 border-b">{className}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">
                    Created At:
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(studentData.createdat).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">
                    Updated At:
                  </td>
                  <td className="py-2 px-4 border-b">
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
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200"
                >
                  <FaUserEdit className="inline-block mr-1" /> Edit Student
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200"
                >
                  <FaTrash className="inline-block mr-1" /> Delete Student
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};
