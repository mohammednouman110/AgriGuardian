import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, MapPin, Clock, Thermometer, Droplets, Wind } from 'lucide-react';

const PestAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ latitude: 12.9716, longitude: 77.5946 });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/reports/pest-alerts', {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius_km: 5
        }
      });
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Mock data for demo
      setAlerts([
        {
          id: 1,
          pest_type: 'Aphids',
          severity: 'high',
          description: 'Heavy aphid infestation reported on tomato crops in nearby fields',
          latitude: 12.9816,
          longitude: 77.6046,
          distance_km: 1.2,
          reported_at: '2024-03-14T10:00:00Z',
          recommendations: [
            'Apply neem oil spray immediately',
            'Introduce ladybugs as natural predators',
            'Remove heavily infested leaves',
            'Monitor neighboring crops daily'
          ]
        },
        {
          id: 2,
          pest_type: 'Whiteflies',
          severity: 'medium',
          description: 'Whitefly population increasing on vegetable crops',
          latitude: 12.9616,
          longitude: 77.5846,
          distance_km: 0.8,
          reported_at: '2024-03-13T15:30:00Z',
          recommendations: [
            'Use yellow sticky traps',
            'Apply insecticidal soap',
            'Improve air circulation around plants'
          ]
        }
      ]);
    }
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    return <AlertTriangle size={20} className={
      severity === 'high' ? 'text-red-600' :
      severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
    } />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading pest alerts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Pest Alerts & Warnings
        </h1>
        <p className="text-gray-600">
          Stay informed about pest outbreaks in your area
        </p>
      </div>

      {/* Current Weather Conditions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Current Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Thermometer className="text-red-500" size={24} />
            <div>
              <p className="font-medium">Temperature</p>
              <p className="text-gray-600">28°C</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Droplets className="text-blue-500" size={24} />
            <div>
              <p className="font-medium">Humidity</p>
              <p className="text-gray-600">65%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Wind className="text-gray-500" size={24} />
            <div>
              <p className="font-medium">Conditions</p>
              <p className="text-gray-600">Moderate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pest Alerts */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertTriangle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Alerts</h3>
            <p className="text-gray-600">Great! No pest outbreaks reported in your area.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {alert.pest_type} Alert
                    </h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center space-x-1 mb-1">
                    <MapPin size={14} />
                    <span>{alert.distance_km.toFixed(1)} km away</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{new Date(alert.reported_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{alert.description}</p>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Recommended Actions:</h4>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {alert.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Pest Button */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Report a Pest Outbreak</h3>
        <p className="text-gray-600 mb-4">
          Help your farming community by reporting pest sightings
        </p>
        <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
          Report Pest
        </button>
      </div>

      {/* Prevention Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Prevention Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Cultural Control</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Crop rotation</li>
              <li>• Proper spacing</li>
              <li>• Remove plant debris</li>
              <li>• Use resistant varieties</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Biological Control</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Introduce beneficial insects</li>
              <li>• Use neem oil</li>
              <li>• Encourage natural predators</li>
              <li>• Maintain biodiversity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestAlerts;