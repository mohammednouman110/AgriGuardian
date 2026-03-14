import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { User, Save, Loader } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    village: '',
    preferred_language: 'english',
    farm_size: '',
    crops_grown: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        village: user.village || '',
        preferred_language: user.preferred_language || 'english',
        farm_size: user.farm_size || '',
        crops_grown: user.crops_grown || []
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCropsChange = (e) => {
    const crops = e.target.value.split(',').map(crop => crop.trim()).filter(crop => crop);
    setFormData(prev => ({
      ...prev,
      crops_grown: crops
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await axios.put('/auth/profile/update', formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Farmer Profile
        </h1>
        <p className="text-gray-600">
          Manage your farming information and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
            </div>

            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-2">
                Village/Location
              </label>
              <input
                type="text"
                id="village"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your village or location"
              />
            </div>

            <div>
              <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language
              </label>
              <select
                id="preferred_language"
                name="preferred_language"
                value={formData.preferred_language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="kannada">Kannada</option>
                <option value="telugu">Telugu</option>
                <option value="tamil">Tamil</option>
              </select>
            </div>

            <div>
              <label htmlFor="farm_size" className="block text-sm font-medium text-gray-700 mb-2">
                Farm Size (acres)
              </label>
              <input
                type="number"
                id="farm_size"
                name="farm_size"
                value={formData.farm_size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter farm size"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="crops_grown" className="block text-sm font-medium text-gray-700 mb-2">
                Crops Grown
              </label>
              <input
                type="text"
                id="crops_grown"
                name="crops_grown"
                value={formData.crops_grown.join(', ')}
                onChange={handleCropsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Rice, Wheat, Tomato"
              />
              <p className="text-xs text-gray-500 mt-1">Separate crops with commas</p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-center ${
              message.includes('successfully')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center space-x-2"
            >
              {saving ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <User className="mr-2" />
          Account Information
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Member since:</span>
            <span className="font-medium">
              {user ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account status:</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;