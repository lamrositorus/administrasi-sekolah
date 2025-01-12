import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; // Import ikon dari react-icons
import { useNavigate } from 'react-router-dom';
export const Kelas = () => {
  const [classes, setClasses] = useState([]); // State to hold class data
  const [error, setError] = useState(''); // State to hold error messages
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [classname, setClassname] = useState(''); // State to hold new class name
  const [successMessage, setSuccessMessage] = useState(''); // State to hold success messages
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await API_Source.getClasses(); // Fetch class data
        setClasses(data); // Set class data in state
      } catch (err) {
        setError('Failed to fetch classes: ' + err.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchClasses();
  }, []); // Run effect only once when the component mounts

  const handleCreateClass = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const data = await API_Source.createClass(classname); // Call createClass function
      setClasses((prevClasses) => [...prevClasses, data]); // Update class list with new class
      setSuccessMessage(`Class "${classname}" created successfully!`); // Set success message
      setClassname(''); // Clear input field
      navigate('/kelas'); // Navigate to the class list page
    } catch (err) {
      setError('Failed to create class: ' + err.message); // Handle error
    }
  };

  if (loading) {
    return <div className="text-center">Loading classes...</div>; // Show loading state
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-6">Class List</h1>
      <form onSubmit={handleCreateClass} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            id="classname"
            value={classname}
            onChange={(e) => setClassname(e.target.value)} // Update state on input change
            required
            placeholder="Enter new class name"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-1" /> Create Class
          </button>
        </div>
      </form>
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}{' '}
      {/* Display success message */}
      {classes.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Class Name</th>
              <th className="py-2 px-4 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.classid} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`${classItem.classid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {classItem.classname}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(classItem.createdat).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No classes found.</p>
      )}
    </div>
  );
};

export default Kelas;
