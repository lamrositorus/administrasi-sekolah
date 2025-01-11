import React, { useState, useEffect } from "react";
import { API_Source } from "../global/Apisource";
import DashboardCard from "../components/DashboardCard";
export const Dashboard = () => {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCard title="Total Students" data={dashboardData.totalStudents} />
      <DashboardCard title="Total Teachers" data={dashboardData.totalTeachers} />
      <DashboardCard title="Total Classes" data={dashboardData.totalClasses} />
      <DashboardCard title="Total Subjects" data={dashboardData.totalSubjects} />
    </div>
  );
};
