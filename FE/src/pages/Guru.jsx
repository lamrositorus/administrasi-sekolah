import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaPlus } from 'react-icons/fa'; // Import ikon dari react-icons

export const Guru = () => {
  const [teachers, setTeachers] = useState([]); // State to hold the list of teachers
  const [subjects, setSubjects] = useState([]); // State to hold the list of subjects
  const [error, setError] = useState(''); // State to hold any error messages
  const [name, setName] = useState(''); // State for the new teacher's name
  const [subjectid, setSubjectId] = useState(''); // State for the new teacher's subject ID

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await API_Source.getTeachers(); // Fetch teacher data
        console.log('Data Guru: ', data);
        setTeachers(data); // Set the teachers data in state
      } catch (err) {
        setError('Failed to fetch teachers: ' + err.message); // Handle error
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await API_Source.getSubjects(); // Fetch subject data
        setSubjects(data); // Set the subjects data in state
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message); // Handle error
      }
    };

    fetchTeachers();
    fetchSubjects(); // Fetch subjects when the component mounts
  }, []); // Run effect only once when the component mounts

  const handleAddTeacher = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      const newTeacher = await API_Source.postTeacher(name, subjectid); // Post new teacher data
      setTeachers((prevTeachers) => [...prevTeachers, newTeacher]); // Update the teachers list with the new teacher
      setName(''); // Clear the name input
      setSubjectId(''); // Clear the subject ID input
    } catch (err) {
      setError('Failed to add teacher: ' + err.message); // Handle error
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-6">Teacher List</h1>
      <form onSubmit={handleAddTeacher} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium">
              Teacher Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaChalkboardTeacher className="w-5 h-5 text-gray-400 ml-2" />
              <input
                type="text"
                id="name"
                placeholder="Enter teacher name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="subjectid" className="block text-sm font-medium">
              Subject
            </label>
            <select
              id="subjectid"
              value={subjectid}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.subjectid} value={subject.subjectid}>
                  {subject.subjectname}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          <FaPlus className="inline-block mr-2" /> Add Teacher
        </button>
      </form>
      {teachers.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => {
              const subject = subjects.find(
                (sub) => sub.subjectid === teacher.subjectid
              );
              return (
                <tr key={teacher.teacherid} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/guru/${teacher.teacherid}`}
                      className="text-blue-600 hover:underline"
                    >
                      {teacher.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {subject ? subject.subjectname : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(teacher.createdat).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No teachers found.</p>
      )}
    </div>
  );
};

export default Guru;
