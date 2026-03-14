import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Camera, Map, Mic, AlertTriangle, BarChart3, Cloud, Droplets, Thermometer } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/reports/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to AgriGuardian AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI Co-Pilot for Smart Agriculture
        </p>
        <Link
          to="/login"
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user.full_name}!
        </h1>
        <p className="text-gray-600">Here's your farming dashboard</p>
      </div>

      {/* Weather Summary */}
      {dashboardData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Cloud className="mr-2" />
            Today's Weather
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Thermometer className="mx-auto mb-2 text-red-500" size={32} />
              <p className="text-2xl font-bold">{dashboardData.weather.temperature}°C</p>
              <p className="text-gray-600">Temperature</p>
            </div>
            <div className="text-center">
              <Droplets className="mx-auto mb-2 text-blue-500" size={32} />
              <p className="text-2xl font-bold">{dashboardData.weather.humidity}%</p>
              <p className="text-gray-600">Humidity</p>
            </div>
            <div className="text-center">
              <Cloud className="mx-auto mb-2 text-gray-500" size={32} />
              <p className="text-lg">{dashboardData.weather.forecast}</p>
              <p className="text-gray-600">Forecast</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/scan-disease"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Camera className="text-green-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Scan Crop Disease</h3>
          <p className="text-gray-600">Upload a photo to detect diseases</p>
        </Link>

        <Link
          to="/crop-health"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Map className="text-green-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Crop Health Map</h3>
          <p className="text-gray-600">View satellite crop health data</p>
        </Link>

        <Link
          to="/voice-assistant"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Mic className="text-green-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
          <p className="text-gray-600">Ask questions in your language</p>
        </Link>

        <Link
          to="/pest-alerts"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <AlertTriangle className="text-yellow-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Pest Alerts</h3>
          <p className="text-gray-600">Check nearby pest warnings</p>
        </Link>

        <Link
          to="/analytics"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <BarChart3 className="text-blue-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Farm Analytics</h3>
          <p className="text-gray-600">View detailed farm insights</p>
        </Link>
      </div>

      {/* Recent Activity */}
      {dashboardData && dashboardData.recent_reports && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {dashboardData.recent_reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{report.message}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  report.type === 'pest_report' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {report.type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;