import React, { useState, useEffect } from 'react';
import { 
  FiLink, 
  FiBarChart2, 
  FiTrendingUp, 
  FiCalendar,
  FiPlus,
  FiSearch
} from 'react-icons/fi';
import UrlTable from '../../components/dashboard/UrlTable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShortener, setShowShortener] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchData();
  }, [pagination.page, search]);

  const fetchData = async () => {
    try {
      const [urlsResponse, statsResponse] = await Promise.all([
        api.get(`/api/dashboard/urls?page=${pagination.page}&limit=${pagination.limit}&search=${search}`),
        api.get('/api/dashboard/stats')
      ]);

      setUrls(urlsResponse.data.urls);
      setPagination(urlsResponse.data.pagination);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (shortCode) => {
    setUrls(urls.filter(url => url.shortCode !== shortCode));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your shortened URLs</p>
            </div>
            <Link
              to='/'
              // onClick={() => setShowShortener(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FiPlus /> Shorten New URL
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total URLs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUrls}</p>
                </div>
                <FiLink className="text-blue-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
                </div>
                <FiBarChart2 className="text-green-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg. Clicks/URL</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUrls > 0 
                      ? Math.round(stats.totalClicks / stats.totalUrls) 
                      : 0}
                  </p>
                </div>
                <FiTrendingUp className="text-purple-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Top URL Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.topUrls[0]?.clicks || 0}
                  </p>
                </div>
                <FiCalendar className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        {stats?.recentClicks?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Clicks Last 7 Days</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.recentClicks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="_id" 
                    stroke="#666"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* URL Shortener Modal */}
        {showShortener && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Shorten New URL</h3>
                  <button
                    onClick={() => setShowShortener(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                {/* <UrlShortener /> */}
                <p>plain text</p>
              </div>
            </div>
          </div>
        )}

        {/* URLs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Your URLs</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search URLs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading URLs...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="p-8 text-center">
              <FiLink className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
              <p className="text-gray-600 mb-4">Start by shortening your first URL!</p>
              <Link to='/'
                // onClick={() => setShowShortener(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create Your First Short URL
              </Link>
            </div>
          ) : (
            <>
              <UrlTable urls={urls} onDelete={handleDelete} />
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Showing page {pagination.page} of {pagination.pages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`px-3 py-1 rounded ${
                          pagination.page === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className={`px-3 py-1 rounded ${
                          pagination.page === pagination.pages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;