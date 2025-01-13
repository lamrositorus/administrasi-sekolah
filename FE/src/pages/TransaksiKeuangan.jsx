import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaPlus, FaUser , FaCalendarAlt } from 'react-icons/fa'; // Import icons from react-icons
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const TransaksiKeuangan = ({ isDarkMode, language }) => {
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
    e.preventDefault(); // Prevent the default form submission behavior

    // Konfirmasi menggunakan SweetAlert
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to add a new transaction.' : 'Anda akan menambahkan transaksi baru.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, add it!' : 'Ya, tambahkan!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal',
    });

    if (result.isConfirmed) {
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
        Swal.fire({
          icon: 'success',
          title: language === 'en' ? 'Transaction Added' : 'Transaksi Ditambahkan',
          text: language === 'en' ? 'The transaction has been added successfully!' : 'Transaksi telah ditambahkan dengan sukses!',
        });
      } catch (err) {
        setError('Failed to add transaction: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}>
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaMoneyBillWave className="inline-block mr-2" />
        {language === 'en' ? 'Monthly SPP' : 'SPP Bulanan'}
      </motion.h1>

      {/* Form for adding a new transaction */}
      <form onSubmit={handlePostTransaction} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="studentId" className="block text-sm font-medium">
              <FaUser  className="inline-block mr-1" />
              {language === 'en' ? 'Select Student' : 'Pilih Siswa'}
            </label>
            <select
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="">{language === 'en' ? 'Select Student' : 'Pilih Siswa'}</option>
              {students.map((student) => (
                <option key={student.studentid} value={student.studentid}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">            
            <label htmlFor="amount" className="block text-sm font-medium">
              <FaMoneyBillWave className="inline-block mr-1" />
              {language === 'en' ? 'Amount' : 'Jumlah'}
            </label>
            <input
              type="text"
              id="amount"
              placeholder={language === 'en' ? 'Enter amount' : 'Masukkan jumlah'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="transactionDate" className="block text-sm font-medium">
              <FaCalendarAlt className="inline-block mr-1" />
              {language === 'en' ? 'Transaction Date' : 'Tanggal Transaksi'}
            </label>
            <input
              type="datetime-local"
              id="transactionDate"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
          </div>
        </div>
        <button
          type="submit"
          className={`mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 ${isDarkMode ? 'hover:bg-blue-500' : ''}`}
        >
          <FaPlus className="inline-block mr-2" /> {language === 'en' ? 'Add Transaction' : 'Tambah Transaksi'}
        </button>
      </form>

      <motion.table
        className={`min-w-full border border-gray-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">{language === 'en' ? 'Student Name' : 'Nama Siswa'}</th>
            <th className="py-2 px-4 border-b text-left">{language === 'en' ? 'Amount' : 'Jumlah'}</th>
            <th className="py-2 px-4 border-b text-left">{language === 'en' ? 'Transaction Date' : 'Tanggal Transaksi'}</th>
            <th className="py-2 px-4 border-b text-left">{language === 'en' ? 'Created At' : 'Dibuat Pada'}</th>
            <th className="py-2 px-4 border-b text-left">{language === 'en' ? 'Updated At' : 'Diperbarui Pada'}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const student = students.find(
              (s) => s.studentid === transaction.studentid
            ); // Find student by ID
            return (
              <tr key={transaction.transactionid} className="hover:bg-zinc-500">
                <td className="py-2 px-4 border-b text-left">
                  <Link
                    to={`${transaction.transactionid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student ? student.name : transaction.studentid}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {transaction.amount
                    ? new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(transaction.amount)
                    : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(transaction.transactiondate).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(transaction.createdat).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {new Date(transaction.updatedat).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </motion.table>
    </div>
  );
};

export default TransaksiKeuangan;