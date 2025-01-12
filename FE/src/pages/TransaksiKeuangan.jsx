import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaPlus } from 'react-icons/fa'; // Import ikon dari react-icons

export const TransaksiKeuangan = () => {
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]); // State for students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the new transaction form
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await API_Source.getTransactions();
        setTransactions(data); // Set the fetched transactions data
      } catch (err) {
        setError('Failed to fetch transactions: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await API_Source.getStudents(); // Fetch students
        setStudents(response); // Adjust based on your API response structure
      } catch (err) {
        setError('Failed to fetch students: ' + err.message);
      }
    };

    fetchTransactions();
    fetchStudents();
  }, []); // Fetch transactions and students when the component mounts

  const handlePostTransaction = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const newTransaction = await API_Source.postTransaction(
        studentId,
        amount,
        transactionDate
      );
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ]); // Add the new transaction to the list
      // Clear the form fields
      setStudentId('');
      setAmount('');
      setTransactionDate('');
      alert('Transaction added successfully.');
    } catch (err) {
      setError('Failed to add transaction: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (transactions.length === 0) {
    return <div>No transactions found.</div>;
  }

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-6">SPP Bulanan</h1>

      {/* Form for adding a new transaction */}
      <form onSubmit={handlePostTransaction} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="studentId" className="block text-sm font-medium">
              Select Student
            </label>
            <select
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.studentid} value={student.studentid}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="transactionDate"
              className="block text-sm font-medium"
            >
              Transaction Date
            </label>
            <input
              type="datetime-local"
              id="transaction Date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          <FaPlus className="inline-block mr-2" /> Add Transaction
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Student Name</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Transaction Date</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const student = students.find(
              (s) => s.studentid === transaction.studentid
            ); // Find student by ID
            return (
              <tr key={transaction.transactionid} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`${transaction.transactionid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student ? student.name : transaction.studentid}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">
                  {transaction.amount
                    ? new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(transaction.amount)
                    : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(transaction.transactiondate).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(transaction.createdat).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(transaction.updatedat).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
