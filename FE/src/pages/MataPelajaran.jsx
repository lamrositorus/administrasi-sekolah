import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; // Import ikon dari react-icons

export const MataPelajaran = () => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [subjectname, setNewSubjectName] = useState(''); // State for new subject name

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await API_Source.getSubjects();
        setSubjects(response); // Set subjects directly from the response
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []); // Empty dependency array to run only once on mount

  const handleAddSubject = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const data = await API_Source.postSubject(subjectname);
      setSubjects((prevSubjects) => [...prevSubjects, data]); // Add the new subject to the list
      setNewSubjectName(''); // Clear the input field
    } catch (err) {
      setError('Failed to add subject: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-6">Mata Pelajaran</h1>
      <form onSubmit={handleAddSubject} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={subjectname}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Enter new subject name"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-1" /> Add Subject
          </button>
        </div>
      </form>
      {subjects.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Subject Name</th>
              <th className="py-2 px-4 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.subjectid} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`${subject.subjectid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {subject.subjectname}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(subject.createdat).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No subjects found.</p>
      )}
    </div>
  );
};

export default MataPelajaran;
