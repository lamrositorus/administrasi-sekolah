import React, { useEffect, useState } from "react";
import { API_Source } from "../global/Apisource";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
export const Siswa = () => {
  const [students, setStudents] = useState([]); // State to hold the list of students
  const [error, setError] = useState(""); // State to hold any error messages
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await API_Source.getStudents(); // Fetch student data
        setStudents(data); // Set the students data in state
      } catch (err) {
        setError("Failed to fetch students: " + err.message); // Handle error
      }
    };

    fetchStudents();
  }, []); // Run effect only once when the component mounts

  if (error) {
    return <div>{error}</div>; // Display error message if any
  }

  return (
    <div>
      <h1>Student List</h1>
      {students.length > 0 ? (
        <ul>
          {students.map((student) => (
            <li key={student.studentid}>
              <p>Student ID: {student.studentid}</p>
              <Link to={`${student.studentid}`}>Name: {student.name}</Link>
              <p>Age: {student.age}</p>
              <p>Class ID: {student.classid}</p>
              <p>Created At: {new Date(student.createdat).toLocaleString()}</p>
              <p>Updated At: {new Date(student.updatedat).toLocaleString()}</p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found.</p> // Message if no students are available
      )}
    </div>
  );
};