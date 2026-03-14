import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CropHealthMap = () => {
  const [mapData, setMapData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const response = await axios.get('/satellite/map-data');
      setMapData(response.data.data_points);
    } catch (error) {
      console.error('Error fetching map data:', error);
      // Mock data for demo
      setMapData([
        { latitude: 12.9716, longitude: 77.5946, ndvi: 0.75, stress_level: 'healthy' },
        { latitude: 12.9816, longitude: 77.6046, ndvi: 0.45, stress_level: 'moderate' },
        { latitude: 12.9616, longitude: 77.5846, ndvi: 0.25, stress_level: 'high' },
      ]);
    }
    setLoading(false);
  };

  const getCircleColor = (stressLevel) => {
    switch (stressLevel) {
      case 'healthy': return '#2E7D32'; // green
      case 'moderate': return '#F9A825'; // yellow
      case 'high': return '#D32F2F'; // red
      default: return '#9E9E9E';
    }
  };

  const getStressDescription = (stressLevel) => {
    switch (stressLevel) {
      case 'healthy': return 'Healthy crops - Good vegetation cover';
      case 'moderate': return 'Moderate stress - Monitor closely';
      case 'high': return 'High stress - Immediate attention needed';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Satellite Crop Health Map
        </h1>
        <p className="text-gray-600">
          View real-time crop health data from satellite imagery
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Legend</h2>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span>Healthy Crops</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Moderate Stress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span>High Stress / Pest Risk</span>
            </div>
          </div>
        </div>

        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mapData.map((point, index) => (
              <Circle
                key={index}
                center={[point.latitude, point.longitude]}
                radius={50}
                pathOptions={{
                  color: getCircleColor(point.stress_level),
                  fillColor: getCircleColor(point.stress_level),
                  fillOpacity: 0.6,
                }}
                eventHandlers={{
                  click: () => setSelectedPoint(point),
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>

      {selectedPoint && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Crop Health Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Location</h3>
              <p>{selectedPoint.latitude.toFixed(4)}, {selectedPoint.longitude.toFixed(4)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">NDVI Value</h3>
              <p className="text-lg font-bold">{selectedPoint.ndvi.toFixed(3)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Health Status</h3>
              <p className={`font-bold ${
                selectedPoint.stress_level === 'healthy' ? 'text-green-600' :
                selectedPoint.stress_level === 'moderate' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {selectedPoint.stress_level.charAt(0).toUpperCase() + selectedPoint.stress_level.slice(1)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{getStressDescription(selectedPoint.stress_level)}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Recommendations</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {selectedPoint.stress_level === 'healthy' && (
                <>
                  <li>Continue current farming practices</li>
                  <li>Monitor regularly for changes</li>
                </>
              )}
              {selectedPoint.stress_level === 'moderate' && (
                <>
                  <li>Increase monitoring frequency</li>
                  <li>Check for early signs of pests or diseases</li>
                  <li>Ensure proper irrigation</li>
                </>
              )}
              {selectedPoint.stress_level === 'high' && (
                <>
                  <li>Immediate field inspection required</li>
                  <li>Check for drought, pests, or diseases</li>
                  <li>Apply appropriate treatments</li>
                  <li>Consult local agricultural expert</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropHealthMap;