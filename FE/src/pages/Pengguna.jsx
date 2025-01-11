import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_Source } from "../global/Apisource";

export const Pengguna = () => {
  const { id } = useParams(); // Get the userid from the URL
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate(); // Hook to navigate after deletion

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await API_Source.getById(id); // Fetch user data by userid
        setProfileData(data); // Set the profile data in state
        setUsername(data.username); // Set initial values for editing
        setRole(data.role);
      } catch (err) {
        setError("Failed to fetch profile data: " + err.message); // Handle error
      }
    };

    fetchProfileData();
  }, [id]); // Run effect when id changes

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const updatedData = await API_Source.updateProfile(id, username, password, role); // Update user data
      setProfileData(updatedData); // Update the profile data in state
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setError("Failed to update profile: " + err.message); // Handle error
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await API_Source.delete(id); // Call the delete method
        alert("Profile deleted successfully.");
        navigate("/pengguna/login"); // Redirect to login page after deletion
      } catch (err) {
        setError("Failed to delete profile: " + err.message); // Handle error
      }
    }
  };

  if (error) {
    return <div>{error}</div>; // Display error message if any
  }

  return (
    <div>
      <h1>User Profile</h1>
      {profileData ? (
        <div>
          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Role:</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Update Profile</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          ) : (
            <div>
              <p>Username: {profileData.username}</p>
              <p>Role: {profileData.role}</p>
              <p>Password: {profileData.password}</p>
              <p>Created At: {new Date(profileData.createdat).toLocaleString()}</p>
              <p>Updated At: {new Date(profileData.updatedat).toLocaleString()}</p>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              <Link to="#" onClick={handleDelete}>Delete Profile</Link> {/* Use Link for deletion */}
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
            </div>
  );
};