import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaBook,
} from 'react-icons/fa'; // Import ikon dari react-icons
import { motion } from 'framer-motion'; // Import motion dari Framer Motion

export const Dashboard = ({ isDarkMode, language }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await API_Source.Dashboard();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div
      className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
    >
      <motion.h1
        className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {language === 'en' ? 'Dashboard' : 'Dashboard'}
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <FaUserGraduate className="w-8 h-8 text-blue-600" />,
            title: language === 'en' ? 'Total Students' : 'Total Siswa',
            value: dashboardData.totalStudents,
          },
          {
            icon: <FaChalkboardTeacher className="w-8 h-8 text-green-600" />,
            title: language === 'en' ? 'Total Teachers' : 'Total Guru',
            value: dashboardData.totalTeachers,
          },
          {
            icon: <FaSchool className="w-8 h-8 text-yellow-600" />,
            title: language === 'en' ? 'Total Classes' : 'Total Kelas',
            value: dashboardData.totalClasses,
          },
          {
            icon: <FaBook className="w-8 h-8 text-purple-600" />,
            title: language === 'en' ? 'Total Subjects' : 'Total Mata Pelajaran',
            value: dashboardData.totalSubjects,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className={`shadow-md rounded-lg p-4 flex items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }} // Delay for staggered effect
          >
            {item.icon}
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
 </div>
  );
};

export default Dashboard;