import { FiBarChart2, FiLock, FiZap, FiGlobe } from "react-icons/fi";

export default function Features() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <FiZap className="text-blue-600 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
        <p className="text-gray-600">
          Create shortened URLs instantly with our optimized system.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <FiBarChart2 className="text-green-600 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Powerful Analytics
        </h3>
        <p className="text-gray-600">
          Track clicks, locations, and referral sources for each link.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <FiLock className="text-purple-600 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Secure & Reliable
        </h3>
        <p className="text-gray-600">
          Enterprise-grade security with 99.9% uptime guarantee.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
          <FiGlobe className="text-orange-600 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
        <p className="text-gray-600">
          Links that work everywhere, optimized for global performance.
        </p>
      </div>
    </div>
  );
}
