import { useState } from "react";
import { Link } from "react-router-dom";
import { FiLink } from "react-icons/fi";
import Navbar from "../../components/shared/Navbar";
import { useAuth } from "../../context/AuthContext";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import Footer from "../../components/shared/Footer";
import Pricing from "./Pricing";
import Features from "./Features";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to shorten URLs");
      return;
    }

    // Check free tier limit
    if (user.tier === "free" && user.urlCount >= 100) {
      toast.error(
        "You have reached your URL limit. Please upgrade to premium."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/url/shorten", {
        originalUrl,
        customCode: customCode || undefined,
      });

      if (response.data.success) {
        setShortenedUrl(response.data.url);
        toast.success("URL shortened successfully!");
        setOriginalUrl("");
        setCustomCode("");
      }
    } catch (error) {
      if (error.response?.data?.limitReached) {
        toast.error("URL limit reached. Please upgrade to premium.");
      } else {
        toast.error(error.response?.data?.message || "Failed to shorten URL");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl.shortUrl);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Shorten Your Long URLs{" "}
              <span className="text-blue-600">in Seconds</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Create short, memorable links and track their performance with
              powerful analytics. Perfect for marketers, content creators, and
              businesses.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* URL Shortener Component */}
          <div className="mb-16">
            {/* <UrlShortener /> */}
            {/* <h1>plain html</h1> */}
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <FiLink className="text-blue-600 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Shorten Your URL
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original URL
                  </label>
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url-path"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="my-custom-link"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    minLength={6}
                    maxLength={8}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    6-8 characters, letters and numbers only
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !user}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
                        ${
                          !user
                            ? "bg-gray-400 cursor-not-allowed"
                            : loading
                            ? "bg-blue-400"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                  {loading ? "Shortening..." : "Shorten URL"}
                </button>

                {!user && (
                  <p className="text-center text-sm text-red-600">
                    Please login to shorten URLs
                  </p>
                )}

                {user?.tier === "free" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      URLs created: {user.urlCount}/100 (Free tier limit)
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(user.urlCount / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </form>

              {shortenedUrl && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">
                    Shortened URL:
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shortenedUrl.shortUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-green-300 rounded bg-white"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                    >
                      <FiCopy />
                      Copy
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      Original:{" "}
                      <span className="truncate">
                        {shortenedUrl.originalUrl}
                      </span>
                    </p>
                    <p>
                      Created:{" "}
                      {new Date(shortenedUrl.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Features />
          <Pricing />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
