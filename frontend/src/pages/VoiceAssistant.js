import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Mic, MicOff, Volume2, MessageCircle } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US'; // Can be changed based on user preference

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      handleVoiceQuery(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceQuery = async (query) => {
    setLoading(true);
    try {
      const response = await axios.post('/chatbot/voice-query', {
        audio_data: 'mock-audio-data', // In production, send actual audio data
        language: 'english'
      });
      setResponse(response.data.response);
      setChatHistory(prev => [...prev, {
        type: 'user',
        message: query,
        timestamp: new Date()
      }, {
        type: 'assistant',
        message: response.data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error with voice query:', error);
      setResponse('Sorry, I couldn\'t process your request. Please try again.');
    }
    setLoading(false);
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Can be changed based on user preference
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Voice AI Assistant
        </h1>
        <p className="text-gray-600">
          Speak your farming questions in English, Hindi, Kannada, Telugu, or Tamil
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Voice Input Section */}
        <div className="text-center mb-8">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          <p className="mt-4 text-lg">
            {isListening ? 'Listening... Speak your question' : 'Tap to speak'}
          </p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">You said:</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">{transcript}</p>
            </div>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">AI Assistant:</h3>
              <button
                onClick={() => speakResponse(response)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
              >
                <Volume2 size={16} />
                <span>Speak</span>
              </button>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">{response}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Processing your request...</p>
          </div>
        )}

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageCircle className="mr-2" />
              Conversation History
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-50 ml-12'
                      : 'bg-green-50 mr-12'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${
                      message.type === 'user' ? 'text-blue-800' : 'text-green-800'
                    }`}>
                      {message.type === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`${
                    message.type === 'user' ? 'text-blue-700' : 'text-green-700'
                  }`}>
                    {message.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Questions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Example Questions:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <p>• "Why are my tomato leaves turning yellow?"</p>
            <p>• "What fertilizer should I use for rice?"</p>
            <p>• "How to control aphids on my crops?"</p>
            <p>• "When should I harvest my wheat?"</p>
            <p>• "What are the signs of pest infestation?"</p>
            <p>• "How much water do my crops need?"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;