/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FiCopy, FiTrash2, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../services/api';

const UrlTable = ({ urls, onDelete }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (shortCode) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await api.delete(`/api/url/${shortCode}`);
        onDelete(shortCode);
        toast.success('URL deleted successfully');
      } catch (error) {
        toast.error('Failed to delete URL');
      }
    }
  };

  const truncateUrl = (url, length = 50) => {
    if (url.length <= length) return url;
    return url.substring(0, length) + '...';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Original URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {urls.map((url) => (
            <React.Fragment key={url.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleRow(url.id)}
                      className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                      {expandedRows[url.id] ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    <div className="group relative">
                      <span className="text-sm text-gray-900">
                        {truncateUrl(url.originalUrl)}
                      </span>
                      <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full left-0 mb-1">
                        {url.originalUrl}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {url.shortCode}
                    </code>
                    <button
                      onClick={() => copyToClipboard(url.shortUrl)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy short URL"
                    >
                      <FiCopy />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {url.clicks}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(url.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                      title="Open URL"
                    >
                      <FiExternalLink />
                    </a>
                    <button
                      onClick={() => handleDelete(url.shortCode)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete URL"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRows[url.id] && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-700">Full URL:</strong>
                        <p className="text-gray-600 break-all">{url.originalUrl}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Short URL:</strong>
                        <p className="text-gray-600">{url.shortUrl}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlTable;