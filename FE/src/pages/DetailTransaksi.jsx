import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { API_Source } from '../global/Apisource'; // Importing the API source
import { FaTrash, FaEdit, FaBook, FaArrowLeft, FaIdCard, FaUser , FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa'; // Importing icons from react-icons
import { motion } from 'framer-motion'; // Import Framer Motion
import Swal from 'sweetalert2'; // Import SweetAlert

export const DetailTransaksi = ({ isDarkMode, language }) => {
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
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You won\'t be able to revert this!' : 'Anda tidak akan dapat mengembalikannya!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, delete it!' : 'Ya, hapus!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await API_Source.deleteTransaction(id);
        Swal.fire(
          language === 'en' ? 'Deleted!' : 'Dihapus!',
          language === 'en' ? 'Transaction has been deleted.' : 'Transaksi telah dihapus.',
          'success'
        );
        navigate('/transaksiKeuangan'); // Redirect to the transaction list
      } catch (err) {
        setError('Failed to delete transaction: ' + err.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const result = await Swal.fire({
      title: language === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?',
      text: language === 'en' ? 'You are about to update this transaction.' : 'Anda akan memperbarui transaksi ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === 'en' ? 'Yes, update it!' : 'Ya, perbarui!',
      cancelButtonText: language === 'en' ? 'Cancel' : 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await API_Source.updateTransaction(
          id,
          studentid,
          amount,
          transactiondate
        );
        Swal.fire(
          language === 'en' ? 'Updated!' : 'Diperbarui!',
          language === 'en' ? 'Transaction updated successfully!' : 'Transaksi berhasil diper barui!',
          'success'
        );
        setIsEditing(false); // Exit editing mode
      } catch (err) {
        Swal.fire(
          language === 'en' ? 'Error!' : 'Kesalahan!',
          language === 'en' ? 'Error updating transaction: ' + err.message : 'Kesalahan saat memperbarui transaksi: ' + err.message,
          'error'
        );
      }
    }
  };

  if (loading) {
    return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Find the student name based on studentid
  const studentName =
    students.find((student) => student.studentid === studentid)?.name ||
    'Unknown Student';

  return (
    <motion.div
      className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'} min-h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6">
        <FaBook className="inline-block mr-2" />
        {language === 'en' ? 'Transaction Details' : 'Detail Transaksi'}
      </h1>
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate(-1)} // Navigate to the previous page
            className={`bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-200 ${isDarkMode ? 'bg-gray-600 text-white' : ''}`}
          >
            <FaArrowLeft className="inline-block mr-1" />
            {language === 'en' ? 'Previous' : 'Sebelumnya'}
          </button>
        </div>
        {transaction ? (
          <div className="flex flex-col">
            <table className={`min-w-full border border-gray-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b font-medium text-left">
                    <FaIdCard className="inline-block mr-1" />
                    {language === 'en' ? 'Transaction ID:' : 'ID Transaksi:'}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {transaction.transactionid}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium text-left">
                    <FaUser  className="inline-block mr-1" />
                    {language === 'en' ? 'Student Name:' : 'Nama Siswa:'}
                  </td>
                  <td className="py-2 px-4 border-b text-left">{studentName}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium text-left">
                    <FaMoneyBillWave className="inline-block mr-1" />
                    {language === 'en' ? 'Amount:' : 'Jumlah:'}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(transaction.amount)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b font-medium text-left">
                    <FaCalendarAlt className="inline-block mr-1" />
                    {language === 'en' ? 'Transaction Date:' : 'Tanggal Transaksi:'}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {new Date(transaction.transactiondate).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="mt-4">
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    {language === 'en' ? 'Student:' : 'Siswa:'}
                  </label>
                  <select
                    value={studentid}
                    onChange={(e) => setStudentId(e.target .value)} // Update studentid state on change
                    required
                    className={`border rounded p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  >
                    {students.map((student) => (
                      <option key={student.studentid} value={student.studentid}>
                        {student.name} {/* Display the student's name */}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    {language === 'en' ? 'Amount:' : 'Jumlah:'}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} // Update amount state on change
                    className={`border rounded p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    {language === 'en' ? 'Transaction Date:' : 'Tanggal Transaksi:'}
                  </label>
                  <input
                    type="datetime-local"
                    value={transactiondate}
                    onChange={(e) => setTransactionDate(e.target.value)} // Update transactiondate state on change
                    required
                    className={`border rounded p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  />
                </div>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200`}
                >
                  {language === 'en' ? 'Update Transaction' : 'Perbarui Transaksi'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`ml-2 bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-200 ${isDarkMode ? 'bg-gray-600 text-white' : ''}`}
                >
                  {language === 'en' ? 'Cancel' : 'Batal'}
                </button>
              </form>
            ) : (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200`}
                >
                  <FaEdit className="inline mr-1" /> {language === 'en' ? 'Edit Transaction' : 'Edit Transaksi'}
                </button>
                <button
                  onClick={handleDelete}
                  className={`bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200`}
                >
                  <FaTrash className="inline mr-1" /> {language === 'en' ? 'Delete Transaction' : 'Hapus Transaksi'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>{language === 'en' ? 'No transaction found.' : 'Transaksi tidak ditemukan.'}</div>
        )}
      </div>
    </motion.div>
  );
};

export default DetailTransaksi;