import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Map, Mic, AlertTriangle, BarChart3, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            AgriGuardian AI
          </Link>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-green-200 flex items-center space-x-1">
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/scan-disease" className="hover:text-green-200 flex items-center space-x-1">
                <Camera size={20} />
                <span>Scan Disease</span>
              </Link>
              <Link to="/crop-health" className="hover:text-green-200 flex items-center space-x-1">
                <Map size={20} />
                <span>Crop Health</span>
              </Link>
              <Link to="/voice-assistant" className="hover:text-green-200 flex items-center space-x-1">
                <Mic size={20} />
                <span>Voice Assistant</span>
              </Link>
              <Link to="/pest-alerts" className="hover:text-green-200 flex items-center space-x-1">
                <AlertTriangle size={20} />
                <span>Pest Alerts</span>
              </Link>
              <Link to="/analytics" className="hover:text-green-200 flex items-center space-x-1">
                <BarChart3 size={20} />
                <span>Analytics</span>
              </Link>
              <Link to="/profile" className="hover:text-green-200 flex items-center space-x-1">
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-green-200 flex items-center space-x-1"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;