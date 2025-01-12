import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_Source } from '../global/Apisource';
import { FaUserEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons

export const Pengguna = () => {
  const { id } = useParams(); // Get the userid from the URL
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate(); // Hook to navigate after deletion

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await API_Source.getById(id); // Fetch user data by userid
        setProfileData(data); // Set the profile data in state
        setUsername(data.username); // Set initial values for editing
        setRole(data.role);
      } catch (err) {
        setError('Failed to fetch profile data: ' + err.message); // Handle error
      }
    };

    fetchProfileData();
  }, [id]); // Run effect when id changes

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const updatedData = await API_Source.updateProfile(
        id,
        username,
        password,
        role
      ); // Update user data
      setProfileData(updatedData); // Update the profile data in state
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setError('Failed to update profile: ' + err.message); // Handle error
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await API_Source.delete(id); // Call the delete method
        alert('Profile deleted successfully.');
        navigate('/pengguna/login'); // Redirect to login page after deletion
      } catch (err) {
        setError('Failed to delete profile: ' + err.message); // Handle error
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      {profileData ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="min-w-full bg-white border border-gray-300">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Username:</td>
                <td className="py-2 px-4 border-b">
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    profileData.username
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Role:</td>
                <td className="py-2 px-4 border-b">
                  {isEditing ? (
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="border border-gray-300 rounded-md p-1"
                    >
                      <option value="adm">Admin</option>
                      <option value="tea">Teacher</option>
                      <option value="stu">Student</option>
                    </select>
                  ) : (
                    profileData.role
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Password:</td>
                <td className="py-2 px-4 border-b">
                  {isEditing ? (
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border border-gray- 300 rounded-md p-1"
                    />
                  ) : (
                    '********' // Hide password in non-edit mode
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Created At:</td>
                <td className="py-2 px-4 border-b">
                  {new Date(profileData.createdat).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium">Updated At:</td>
                <td className="py-2 px-4 border-b">
                  {new Date(profileData.updatedat).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-between">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Update Profile
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 flex items-center"
                >
                  <FaUserEdit className="mr-2" /> Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete Profile
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};
