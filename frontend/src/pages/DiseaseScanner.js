import React, { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Camera, Upload, Loader } from 'lucide-react';

const DiseaseScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setResult(null);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setShowCamera(false);
          setResult(null);
        });
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post('/disease/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({
        disease: 'Error',
        confidence: 0,
        treatment: 'Unable to analyze image. Please try again.',
        organic_pesticide: 'N/A'
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Crop Disease Scanner
        </h1>
        <p className="text-gray-600">
          Upload or capture a photo of your crop leaves to detect diseases
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setShowCamera(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Camera size={20} />
            <span>Take Photo</span>
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {showCamera && (
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="border rounded-lg"
                width={400}
                height={300}
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Capture
              </button>
              <button
                onClick={() => setShowCamera(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="mb-6">
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected crop"
                className="max-w-md max-h-64 border rounded-lg"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={analyzeImage}
                disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading && <Loader className="animate-spin" size={20} />}
                <span>{loading ? 'Analyzing...' : 'Analyze Disease'}</span>
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Disease Detected</h3>
                <p className="text-xl font-bold text-red-600">{result.disease}</p>
                <p className="text-gray-600">Confidence: {result.confidence}%</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Treatment</h3>
                <p className="text-gray-700">{result.treatment}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Organic Pesticide Recommendation</h3>
              <p className="text-gray-700">{result.organic_pesticide}</p>
            </div>
            {result.recommendation && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-blue-800">{result.recommendation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseScanner;