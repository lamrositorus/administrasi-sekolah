import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { API_Source } from '../global/Apisource'; // Importing the API source
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importing icons from react-icons

export const DetailTransaksi = () => {
  const { id } = useParams(); // Get the transaction ID from the URL parameters
  const navigate = useNavigate(); // Initialize navigate
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]); // State to hold the list of students
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [studentid, setStudentId] = useState(''); // State for student ID
  const [amount, setAmount] = useState(''); // State for amount
  const [transactiondate, setTransactionDate] = useState(''); // State for transaction date

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await API_Source.getTransactionById(id);
        setTransaction(data);
        setStudentId(data.studentid);
        setAmount(data.amount);
        setTransactionDate(data.transactiondate);
      } catch (err) {
        setError('Failed to fetch transaction: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        const data = await API_Source.getStudents(); // Fetch all students
        setStudents(data); // Set the students data in state
      } catch (err) {
        setError('Failed to fetch students: ' + err.message);
      }
    };

    fetchTransaction();
    fetchStudents(); // Fetch students when the component mounts
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await API_Source.deleteTransaction(id);
        alert('Transaction deleted successfully.');
        navigate('/transaksiKeuangan'); // Redirect to the transaction list
      } catch (err) {
        setError('Failed to delete transaction: ' + err.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await API_Source.updateTransaction(
        id,
        studentid,
        amount,
        transactiondate
      );
      alert('Transaction updated successfully');
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      alert('Error updating transaction: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Find the student name based on studentid
  const studentName =
    students.find((student) => student.studentid === studentid)?.name ||
    'Unknown Student';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detail Transaksi</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate(-1)} // Navigate to the previous page
            className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Previous
          </button>
        </div>
        {transaction ? (
          <div className="flex flex-col">
            <table className="min-w-full bg-white border border-gray-300">
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">
                    Transaction ID:
                  </td>
                  <td className="py-2 px-4 border-b">
                    {transaction.transactionid}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">
                    Student Name:
                  </td>
                  <td className="py-2 px-4 border-b">{studentName}</td>
                </tr>
                <tr>
                  <td className=" py-2 px-4 border-b font-medium">Amount:</td>
                  <td className="py-2 px-4 border-b">{transaction.amount}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium">
                    Transaction Date:
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(transaction.transactiondate).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="mt-4">
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Student:</label>
                  <select
                    value={studentid}
                    onChange={(e) => setStudentId(e.target.value)} // Update studentid state on change
                    required
                    className="border rounded p-2"
                  >
                    {students.map((student) => (
                      <option key={student.studentid} value={student.studentid}>
                        {student.name} {/* Display the student's name */}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Amount:</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} // Update amount state on change
                    required
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Transaction Date:
                  </label>
                  <input
                    type="datetime-local"
                    value={transactiondate}
                    onChange={(e) => setTransactionDate(e.target.value)} // Update transactiondate state on change
                    required
                    className="border rounded p-2 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Update Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="ml-2 bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200"
                >
                  <FaEdit className="inline mr-1" /> Edit Transaction
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200"
                >
                  <FaTrash className="inline mr-1" /> Delete Transaction
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>No transaction found.</div>
        )}
      </div>
    </div>
  );
};
