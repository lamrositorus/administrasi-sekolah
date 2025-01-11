import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_Source } from '../global/Apisource';

export const DetailSiswa = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [studentData, setStudentData] = useState(null); // State to hold student data
  const [error, setError] = useState(""); // State to hold any error messages

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await API_Source.getStudentById(id); // Fetch student data by ID
        setStudentData(data); // Set the student data in state
      } catch (err) {
        setError("Failed to fetch student data: " + err.message); // Handle error
      }
    };

    fetchStudentData();
  }, [id]); // Run effect when ID changes

  if (error) {
    return <div>{error}</div>; // Display error message if any
  }

  return (
    <div>
      <h1>Student Details</h1>
      {studentData ? (
        <div>
          <p>Student ID: {studentData.studentid}</p>
          <p>Name: {studentData.name}</p>
          <p>Age: {studentData.age}</p>
          <p>Class ID: {studentData.classid}</p>
          <p>Created At: {new Date(studentData.createdat).toLocaleString()}</p>
          <p>Updated At: {new Date(studentData.updatedat).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading...</p> // Show loading state while fetching data
      )}
    </div>
  );
};