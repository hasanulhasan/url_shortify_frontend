import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600">Start free, upgrade when you need more</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Tier</h3>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600 ml-2">/month</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>100 shortened URLs</span>
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>Basic analytics</span>
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>Custom short codes</span>
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>30-day link history</span>
            </li>
          </ul>
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold"
            >
              Get Started Free
            </Link>
          ) : (
            <div className="text-center py-3 text-green-600 font-semibold">
              ✓ Currently Active
            </div>
          )}
        </div>

        <div className="border-2 border-gray-300 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900">$9</span>
              <span className="text-gray-600 ml-2">/month</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>Unlimited shortened URLs</span>
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>Custom domains</span>
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>Team collaboration</span>
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" />
              <span>Priority support</span>
            </li>
          </ul>
          <button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
