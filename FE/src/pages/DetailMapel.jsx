import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importing useParams and useNavigate from react-router-dom
import { API_Source } from '../global/Apisource'; // Importing the API source
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importing icons from react-icons

export const DetailMapel = () => {
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
        console.log('Fetched subject data:', data);
        setSubject(data); // Set the fetched subject data
        setNewSubjectName(data.subjectname); // Initialize the subject name for editing
      } catch (err) {
        setError('Failed to fetch subject: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await API_Source.getSubjects(); // Fetch all subjects
        setSubjects(data); // Set the subjects data in state
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message);
      }
    };

    fetchSubject();
    fetchSubjects(); // Call fetchSubjects to get the list of subjects
  }, [id]); // Fetch subject when the component mounts or when the ID changes

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await API_Source.deleteSubject(id);
        alert('Subject deleted successfully.');
        navigate('/mataPelajaran'); // Redirect to the subject list
      } catch (err) {
        setError('Failed to delete subject: ' + err.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const updatedSubject = await API_Source.updateSubject(id, newSubjectName);
      setSubject(updatedSubject); // Update the subject state with the new data
      alert('Subject updated successfully.');
    } catch (err) {
      setError('Failed to update subject: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!subject) {
    return <div>No subject found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detail Mata Pelajaran</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full bg-white border border-gray-300">
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b font-medium">ID:</td>
              <td className="py-2 px-4 border-b">{subject.subjectid}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-medium">Name:</td>
              <td className="py-2 px-4 border-b">{subject.subjectname}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-medium">Created At:</td>
              <td className="py-2 px-4 border-b">
                {new Date(subject.createdat).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-medium">Updated At:</td>
              <td className="py-2 px-4 border-b">
                {new Date(subject.updatedat).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        <form onSubmit={handleUpdate} className="mt-4">
          <label className="block mb-2 font-medium">Update Subject Name:</label>
          <select
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)} // Update newSubjectName state on change
            required
            className="border rounded p-2 mb-4"
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
            className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            <FaEdit className="mr-2" /> Update Subject
          </button>
        </form>

        <button
          onClick={handleDelete}
          className="flex items-center bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200 mt-4"
        >
          <FaTrash className="mr-2" /> Delete Subject
        </button>
      </div>
    </div>
  );
};
