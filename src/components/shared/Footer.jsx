import { FiLink } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center space-x-2">
                <FiLink className="h-6 w-6" />
                <span className="text-xl font-bold">Shortify</span>
              </Link>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white">Help</a>
            </div>
          </div>
        </div>
      </footer>
  )
}
