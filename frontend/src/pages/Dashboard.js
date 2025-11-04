import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services';
import '../App.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username} ({user?.role})</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {dashboardData && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{dashboardData.users}</p>
              </div>
              <div className="stat-card">
                <h3>Campuses</h3>
                <p className="stat-value">{dashboardData.campuses}</p>
              </div>
            </div>

            <div className="modules-section">
              <h2>Loaded Modules</h2>
              <div className="modules-grid">
                {dashboardData.modules?.map((module) => (
                  <div key={module.name} className="module-card">
                    <h3>{module.name}</h3>
                    <p>Version: {module.version}</p>
                    <p>Status: {module.enabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                ))}
              </div>
            </div>

            {dashboardData.moduleStats && Object.keys(dashboardData.moduleStats).length > 0 && (
              <div className="module-stats-section">
                <h2>Module Statistics</h2>
                {Object.entries(dashboardData.moduleStats).map(([moduleName, stats]) => (
                  <div key={moduleName} className="module-stat-card">
                    <h3>{moduleName}</h3>
                    <div className="stats-grid">
                      {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="stat-item">
                          <span className="stat-label">{key}:</span>
                          <span className="stat-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
