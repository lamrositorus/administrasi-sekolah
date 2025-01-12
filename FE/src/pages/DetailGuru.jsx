import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_Source } from '../global/Apisource';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import icons from react-icons

export const DetailGuru = () => {
  const { id } = useParams(); // Get the teacher ID from the URL
  const [teacherData, setTeacherData] = useState(null); // State to hold teacher data
  const [subjects, setSubjects] = useState([]); // State to hold subjects data
  const [error, setError] = useState(''); // State to hold any error messages
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
  const [name, setName] = useState(''); // State for teacher name
  const [subjectid, setSubjectId] = useState(''); // State for subject ID
  const navigate = useNavigate(); // Hook to navigate after deletion

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const data = await API_Source.getTeacherById(id); // Fetch teacher data by ID
        setTeacherData(data); // Set the teacher data in state
        setName(data.name); // Set initial values for editing
        setSubjectId(data.subjectid); // Set initial subject ID for editing
      } catch (err) {
        setError('Failed to fetch teacher data: ' + err.message); // Handle error
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await API_Source.getSubjects(); // Fetch subjects data
        setSubjects(data); // Set the subjects data in state
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message); // Handle error
      }
    };

    fetchTeacherData();
    fetchSubjects(); // Fetch subjects when the component mounts
  }, [id]); // Run effect when ID changes

  const handleUpdate = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const updatedData = await API_Source.updateTeacher(id, name, subjectid); // Update teacher data
      setTeacherData(updatedData); // Update the teacher data in state
      navigate('/guru'); // Redirect to the teacher list after updating
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setError('Failed to update teacher data: ' + err.message); // Handle error
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await API_Source.deleteTeacher(id); // Call the delete method
        alert('Teacher deleted successfully.');
        navigate('/guru'); // Redirect to the teacher list after deletion
      } catch (err) {
        setError('Failed to delete teacher: ' + err.message); // Handle error
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  // Find the subject name based on subjectid
  const subjectName =
    subjects.find((subject) => subject.subjectid === teacherData?.subjectid)
      ?.subjectname || 'Unknown Subject';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Teacher Details</h1>
      {teacherData ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded w-full py-2 px-3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Subject:</label>
                <select
                  value={subjectid}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="border rounded w-full py-2 px-3"
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
              <table className="min-w-full bg-white border border-gray-300">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">Name:</td>
                    <td className="py-2 px-4 border-b">{teacherData.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">Subject:</td>
                    <td className="py-2 px-4 border-b">{subjectName}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">
                      Created At:
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(teacherData.createdat).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">
                      Updated At:
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(teacherData.updatedat).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit Teacher
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200 flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete Teacher
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Loading...</p> // Show loading state while fetching data
      )}
    </div>
  );
};
