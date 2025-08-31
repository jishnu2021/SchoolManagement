import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Mail, Calendar, BookOpen, Users, Award, Globe, Sparkles } from 'lucide-react';

const SchoolViewPopup = ({ school, isOpen, onClose }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  useEffect(() => {
    if (isOpen && school) {
      fetchDescription();
      fetchImage();
    }
  }, [isOpen, school]);

  const fetchDescription = async () => {
    setLoading(true);
    try {
    console.log("id is ", school.id);
    
      const response = await fetch(`${API_BASE_URL}/schools/${school.id}/regenerate-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
       console.log("the resukt is ", data);
      if (data.success) {
        setDescription(data.description || '');
      }
    } catch (error) {
      console.error('Error fetching description:', error);
      setDescription(school?.description || 'A distinguished educational institution committed to excellence in education and student development.');
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async () => {
    if (!school?.id) return;
    
    setImageLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/images/school/${school.id}?width=600&height=400&crop=fill&format=webp&quality=auto`);
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.transformedUrl);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const formatDescription = (text) => {
    if (!text) return '';
    
    // Split into sentences for better formatting
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    
    return sentences.map((sentence, index) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length === 0) return null;
      
      return (
        <span key={index} className="block mb-3 leading-relaxed">
          {trimmedSentence}
        </span>
      );
    }).filter(Boolean);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'SC';
  };

  if (!isOpen || !school) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out">
        
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-start space-x-6">
            
            <div className="flex-shrink-0">
              {imageLoading ? (
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={school.name}
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white border-opacity-30 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl font-bold">
                  {getInitials(school.name)}
                </div>
              )}
            </div>
            
            {/* School Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-2 leading-tight">{school.name}</h1>
              <div className="flex items-center space-x-2 text-blue-100">
                <MapPin size={16} />
                <span className="text-sm">{school.city}, {school.state}</span>
              </div>
              <div className="mt-3 flex items-center space-x-1">
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-sm font-medium text-blue-100">AI-Powered Description</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">{school.address}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">{school.contact}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800 truncate">{school.email_id}</p>
              </div>
            </div>
          </div>

          {/* School Description */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen size={24} className="text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">About Our School</h2>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating personalized description...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles size={16} className="text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600">AI Generated Description</span>
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {formatDescription(description)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* School Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl">
              <Users size={32} className="mx-auto mb-3" />
              <h3 className="font-bold text-lg">Community Focus</h3>
              <p className="text-blue-100 text-sm mt-2">Building strong community connections</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl">
              <Award size={32} className="mx-auto mb-3" />
              <h3 className="font-bold text-lg">Academic Excellence</h3>
              <p className="text-green-100 text-sm mt-2">Committed to outstanding results</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl">
              <Globe size={32} className="mx-auto mb-3" />
              <h3 className="font-bold text-lg">Global Perspective</h3>
              <p className="text-purple-100 text-sm mt-2">Preparing for tomorrow's world</p>
            </div>
          </div>

          {/* School Image Gallery */}
          {imageUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Calendar size={20} />
                <span>School Gallery</span>
              </h3>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={imageUrl}
                  alt={school.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => fetchDescription()}
              disabled={loading}
              className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Sparkles size={16} />
              <span>{loading ? 'Regenerating...' : 'Regenerate Description'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolViewPopup