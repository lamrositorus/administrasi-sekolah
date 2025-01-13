import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { API_Source } from '../global/Apisource'; // Importing the API source
import { FaUserEdit, FaTrash, FaUser , FaLock, FaCalendarAlt } from 'react-icons/fa'; // Importing icons from react-icons
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const Pengguna = ({ isDarkMode, language }) => {
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
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to update this profile.' : 'Anda akan memperbarui profil ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, update it!' : 'Ya, perbarui!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const updatedData = await API_Source.updateProfile(
          id,
          username,
          password,
          role
        ); // Update user data
        setProfileData(updatedData); // Update the profile data in state
        setIsEditing(false); // Exit editing mode
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Updated!' : 'Diperbarui!',
          text: language === 'en' ? 'Profile updated successfully.' : 'Profil telah diperbarui.',
        });
      } catch (err) {
        setError('Failed to update profile: ' + err.message); // Handle error
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to delete this profile.' : 'Anda akan menghapus profil ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, delete it!' : 'Ya, hapus!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await API_Source.delete(id); // Call the delete method
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Deleted!' : 'Dihapus!',
          text: language === 'en' ? 'Profile deleted successfully.' : 'Profil telah dihapus.',
        });
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
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}>
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaUser  className="inline-block mr-2" />
        {language === 'en' ? 'User  Profile' : 'Profil Pengguna'}
      </motion.h1>
      {profileData ? (
        <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <motion.table
            className="min-w-full border border-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaUser  className="inline-block mr-1" /> {language === 'en' ? 'Username:' : 'Username:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={`border border-gray-300 rounded-md p-1 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                  ) : (
                    profileData.username
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaUser  className="inline-block mr-1" /> {language === 'en' ? 'Role:' : 'Peran:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {isEditing ? (
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className={`border border-gray-300 rounded-md p-1 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    >
                      <option value="adm">{language === 'en' ? 'Admin' : 'Admin'}</option>
                      <option value="tea">{language === 'en' ? 'Teacher' : 'Guru'}</option>
                      <option value="stu">{language === 'en' ? 'Student' : 'Siswa'}</option>
                    </select>
                  ) : (
                    profileData.role
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaLock className="inline-block mr-1" /> {language === 'en' ? 'Password:' : 'Kata Sandi:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {isEditing ? (
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`border border-gray-300 rounded-md p-1 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                  ) : (
                    '********' // Hide password in non-edit mode
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaCalendarAlt className="inline-block mr-1" /> {language === 'en' ? 'Created At:' : 'Dibuat Pada:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(profileData.createdat).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-medium text-left">
                  <FaCalendarAlt className="inline-block mr-1" /> {language === 'en' ? 'Updated At:' : 'Diperbarui Pada:'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(profileData.updatedat).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </motion.table>
          <div className="mt-4 flex justify-between">
            {isEditing ? <>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  {language === 'en' ? 'Update Profile' : 'Perbarui Profil'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
                >
                  {language === 'en' ? 'Cancel' : 'Batal'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 flex items-center"
                >
                  <FaUserEdit className="mr-2" /> {language === 'en' ? 'Edit Profile' : 'Edit Profil'}
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 flex items-center"
                >
                  <FaTrash className="mr-2" /> {language === 'en' ? 'Delete Profile' : 'Hapus Profil'}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center">{language === 'en' ? 'Loading...' : 'Memuat...'}</p>
      )}
    </div>
  );
};

export default Pengguna;