import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaBook,
} from 'react-icons/fa'; // Import ikon dari react-icons

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
      <h1
        className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        {language === 'en' ? 'Dashboard' : 'Dasbor'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`bg-white shadow-md rounded-lg p-4 flex items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          <FaUserGraduate className="w-8 h-8 text-blue-600" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">
              {language === 'en' ? 'Total Students' : 'Total Siswa'}
            </h2>
            <p className="text-2xl font-bold">{dashboardData.totalStudents}</p>
          </div>
        </div>
        <div
          className={`bg-white shadow-md rounded-lg p-4 flex items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          <FaChalkboardTeacher className="w-8 h-8 text-green-600" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">
              {language === 'en' ? 'Total Teachers' : 'Total Guru'}
            </h2>
            <p className="text-2xl font-bold">{dashboardData.totalTeachers}</p>
          </div>
        </div>
        <div
          className={`bg-white shadow-md rounded-lg p-4 flex items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          <FaSchool className="w-8 h-8 text-yellow-600" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">
              {language === 'en' ? 'Total Classes' : 'Total Kelas'}
            </h2>
            <p className="text-2xl font-bold">{dashboardData.totalClasses}</p>
          </div>
        </div>
        <div
          className={`bg-white shadow-md rounded-lg p-4 flex items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
        >
          <FaBook className="w-8 h-8 text-purple-600" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">
              {language === 'en' ? 'Total Subjects' : 'Total Mata Pelajaran'}
            </h2>
            <p className="text-2xl font-bold">{dashboardData.totalSubjects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
