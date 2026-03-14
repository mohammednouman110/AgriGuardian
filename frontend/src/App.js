import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DiseaseScanner from './pages/DiseaseScanner';
import CropHealthMap from './pages/CropHealthMap';
import VoiceAssistant from './pages/VoiceAssistant';
import PestAlerts from './pages/PestAlerts';
import FarmAnalytics from './pages/FarmAnalytics';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scan-disease" element={<DiseaseScanner />} />
              <Route path="/crop-health" element={<CropHealthMap />} />
              <Route path="/voice-assistant" element={<VoiceAssistant />} />
              <Route path="/pest-alerts" element={<PestAlerts />} />
              <Route path="/analytics" element={<FarmAnalytics />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;