// Komponen DashboardCard
import React from 'react';
const DashboardCard = ({ title, data }) => {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      <p>{data}</p>
    </div>
  );
};
export default DashboardCard;
