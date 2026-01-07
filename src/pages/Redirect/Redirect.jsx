import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiLoader, FiAlertCircle, FiExternalLink } from 'react-icons/fi';
import api from '../../services/api';

const Redirect = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        setLoading(true);
        
        // Make API call to get the original URL
        const response = await api.get(`/api/url/${shortCode}`, {
          // Don't follow redirects automatically
          maxRedirects: 0,
          validateStatus: function (status) {
            return status >= 200 && status < 303; // Accept 2xx and 3xx
          }
        });

        // Handle different status codes
        if (response.status === 301 || response.status === 302) {
          // Extract URL from headers
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            // Redirect after a short delay to show loading state
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1500);
          } else {
            throw new Error('Redirect URL not found');
          }
        } else {
          // Handle other successful responses
          const data = response.data;
          if (data && data.url) {
            setTimeout(() => {
              window.location.href = data.url;
            }, 1500);
          } else {
            throw new Error('Invalid response format');
          }
        }
      } catch (error) {
        console.error('Redirect error:', error);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
          setError('This shortened URL does not exist or has been deleted.');
        } else if (error.response?.status === 410) {
          setError('This link has expired.');
        } else if (error.response?.status === 429) {
          setError('Too many requests. Please try again later.');
        } else if (error.code === 'NETWORK_ERROR') {
          setError('Network error. Please check your internet connection.');
        } else {
          setError('Failed to redirect. The link may be invalid or broken.');
        }
        setLoading(false);
      }
    };

    if (shortCode) {
      redirectToUrl();
    } else {
      setError('Invalid short code');
      setLoading(false);
    }
  }, [shortCode, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {loading ? (
          <>
            <div className="mx-auto w-20 h-20 mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Redirecting...</h1>
            <p className="text-gray-600 mb-6">
              Taking you to your destination in just a moment
            </p>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-pulse" style={{ width: '70%' }}></div>
              </div>
              <p className="text-sm text-gray-500">Processing short code: <code className="bg-gray-100 px-2 py-1 rounded">{shortCode}</code></p>
            </div>
          </>
        ) : error ? (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <FiAlertCircle className="text-red-600 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <FiExternalLink />
                Try Again
              </button>
              <button
                onClick={handleGoHome}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
              >
                Go to Homepage
              </button>
            </div>
          </>
        ) : null}

        {/* Additional information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Short Code:</strong>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">{shortCode}</code>
            </p>
            <p className="text-xs text-gray-500">
              This redirect is powered by Short.ly - A modern URL shortener service
            </p>
          </div>
        </div>

        {/* Safety notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Safety Tip:</strong> Always verify URLs before clicking. 
            Make sure you trust the source of this shortened link.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Redirect;