import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Droplets, Thermometer, Activity, Calendar } from 'lucide-react';

const FarmAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data - in production, fetch from API
      setAnalyticsData({
        soilMoisture: {
          current: 45,
          trend: 'stable',
          history: [42, 44, 46, 43, 45, 47, 45]
        },
        temperature: {
          current: 28,
          trend: 'increasing',
          history: [26, 27, 28, 29, 27, 28, 28]
        },
        cropHealth: {
          current: 72,
          trend: 'improving',
          history: [68, 70, 69, 71, 73, 72, 72]
        },
        pestRisk: {
          current: 25,
          trend: 'decreasing',
          history: [35, 32, 28, 30, 26, 25, 25]
        },
        irrigation: {
          lastIrrigation: '2024-03-13T06:00:00Z',
          nextRecommended: '2024-03-15T06:00:00Z',
          waterUsed: 1250 // liters per hectare
        },
        alerts: [
          {
            type: 'irrigation',
            message: 'Irrigation recommended for rice field',
            priority: 'medium'
          },
          {
            type: 'fertilizer',
            message: 'Nitrogen levels low in wheat field',
            priority: 'high'
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'decreasing': return 'text-red-600';
      case 'increasing': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    return <TrendingUp size={16} className={getTrendColor(trend)} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Farm Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your farm's performance and get insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Droplets className="text-blue-600" size={32} />
            {getTrendIcon(analyticsData.soilMoisture.trend)}
          </div>
          <h3 className="text-lg font-semibold mb-2">Soil Moisture</h3>
          <p className="text-3xl font-bold text-blue-600">{analyticsData.soilMoisture.current}%</p>
          <p className="text-sm text-gray-600 capitalize">{analyticsData.soilMoisture.trend}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="text-red-600" size={32} />
            {getTrendIcon(analyticsData.temperature.trend)}
          </div>
          <h3 className="text-lg font-semibold mb-2">Temperature</h3>
          <p className="text-3xl font-bold text-red-600">{analyticsData.temperature.current}°C</p>
          <p className="text-sm text-gray-600 capitalize">{analyticsData.temperature.trend}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="text-green-600" size={32} />
            {getTrendIcon(analyticsData.cropHealth.trend)}
          </div>
          <h3 className="text-lg font-semibold mb-2">Crop Health</h3>
          <p className="text-3xl font-bold text-green-600">{analyticsData.cropHealth.current}%</p>
          <p className="text-sm text-gray-600 capitalize">{analyticsData.cropHealth.trend}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="text-yellow-600" size={32} />
            {getTrendIcon(analyticsData.pestRisk.trend)}
          </div>
          <h3 className="text-lg font-semibold mb-2">Pest Risk</h3>
          <p className="text-3xl font-bold text-yellow-600">{analyticsData.pestRisk.current}%</p>
          <p className="text-sm text-gray-600 capitalize">{analyticsData.pestRisk.trend}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Soil Moisture Trend</h3>
          <div className="h-48 flex items-end justify-between space-x-2">
            {analyticsData.soilMoisture.history.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-blue-500 w-8 rounded-t"
                  style={{ height: `${value * 2}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{index + 1}d</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Crop Health Trend</h3>
          <div className="h-48 flex items-end justify-between space-x-2">
            {analyticsData.cropHealth.history.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-green-500 w-8 rounded-t"
                  style={{ height: `${value * 1.5}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{index + 1}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Irrigation Schedule */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Droplets className="mr-2 text-blue-600" />
          Irrigation Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Last Irrigation</h4>
            <p className="text-gray-600 flex items-center">
              <Calendar size={16} className="mr-1" />
              {new Date(analyticsData.irrigation.lastIrrigation).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Next Recommended</h4>
            <p className="text-gray-600 flex items-center">
              <Calendar size={16} className="mr-1" />
              {new Date(analyticsData.irrigation.nextRecommended).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Water Usage</h4>
            <p className="text-gray-600">{analyticsData.irrigation.waterUsed} L/ha</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
        <div className="space-y-3">
          {analyticsData.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.priority === 'high'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`font-medium ${
                  alert.priority === 'high' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {alert.message}
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  alert.priority === 'high'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {alert.priority.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Optimal Irrigation</h4>
            <p className="text-green-700 text-sm">
              Based on current soil moisture and weather forecast, maintain current irrigation schedule.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Fertilizer Application</h4>
            <p className="text-blue-700 text-sm">
              Apply nitrogen-rich fertilizer to wheat fields within the next 3 days.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Pest Monitoring</h4>
            <p className="text-yellow-700 text-sm">
              Continue monitoring for aphids. Current risk level is low but weather conditions are favorable for pest development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmAnalytics;