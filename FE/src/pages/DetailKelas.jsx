import React, { useEffect, useState } from 'react';
import { API_Source } from '../global/Apisource'; // Importing the API source
import { useParams, useNavigate } from 'react-router-dom'; // Importing useParams and useNavigate from react-router-dom
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importing icons from react-icons

export const DetailKelas = () => {
  const { id } = useParams(); // Accessing the class ID parameter from the URL
  const [classDetails, setClassDetails] = useState(null); // State to hold class details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages
  const [classname, setClassname] = useState(''); // State to manage the class name for updates
  const [classes, setClasses] = useState([]); // State to hold the list of classes
  const navigate = useNavigate(); // Hook to navigate after deletion

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const data = await API_Source.getClassesById(id); // Fetch class details using the API
        setClassDetails(data); // Set the fetched class details in state
        setClassname(data.classname); // Initialize classname state with fetched data
      } catch (error) {
        setError(error.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchClasses = async () => {
      try {
        const data = await API_Source.getClasses(); // Fetch all classes
        setClasses(data); // Set the classes data in state
      } catch (error) {
        setError(error.message); // Set error message if fetching fails
      }
    };

    fetchClassDetails(); // Call the function to fetch class details
    fetchClasses(); // Call the function to fetch all classes
  }, [id]); // Dependency array includes id to refetch if it changes

  // Function to handle class deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await API_Source.deleteClass(id); // Call the deleteClass method
        alert('Class deleted successfully!'); // Notify user of success
        navigate('/kelas'); // Redirect to the class list
      } catch (error) {
        setError(error.message); // Set error message if deletion fails
      }
    }
  };

  // Function to handle class update
  const handleUpdate = async () => {
    try {
      await API_Source.updateClass(id, classname); // Call the updateClass method
      alert('Class updated successfully!'); // Notify user of success
    } catch (error) {
      setError(error.message); // Set error message if update fails
    }
  };

  // Render loading state
  if (loading) return <div>Loading...</div>;

  // Render error state
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Render class details if available
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Class Details</h1>
      {classDetails ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="min-w-full bg-white border border-gray-300">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Class ID:</td>
                <td className="py-2 px-4 border-b">{classDetails.classid}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Class Name:</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={classname}
                    onChange={(e) => setClassname(e.target.value)} // Update classname state on select change
                    className="border rounded p-1"
                  >
                    {classes.map((classItem) => (
                      <option
                        key={classItem.classid}
                        value={classItem.classname}
                      >
                        {classItem.classname} {/* Display the class name */}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>{' '}
              <tr>
                <td className="py-2 px-4 border-b font-medium">Created At:</td>
                <td className="py-2 px-4 border-b">
                  {new Date(classDetails.createdat).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Updated At:</td>
                <td className="py-2 px-4 border-b">
                  {new Date(classDetails.updatedat).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleUpdate}
              className="flex items-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              <FaEdit className="mr-2" /> Update Class
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              <FaTrash className="mr-2" /> Delete Class
            </button>
          </div>
        </div>
      ) : (
        <p>No class details available.</p>
      )}
    </div>
  );
};
