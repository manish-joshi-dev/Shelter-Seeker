import React from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { FaSearch, FaHome, FaInfoCircle, FaUser, FaSignInAlt, FaUserShield } from 'react-icons/fa';

function header() {
  const currentUser = useSelector((state)=>state.user);
  const navigate = useNavigate(); 
  const [searchTerm,setSearchTerm] = useState('');
  console.log(currentUser);


const handleSubmit = async(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
};




useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const searchTermFromUrl = urlParams.get('searchTerm');
  if (searchTermFromUrl) {
    setSearchTerm(searchTermFromUrl);
  }
}, [location.search]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-display font-bold">
                <span className="text-primary-600">Shelter</span>
                <span className="text-secondary-600">Seeker</span>
              </h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  className="w-full pl-4 pr-12 py-3 border border-neutral-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-neutral-50 hover:bg-white"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-neutral-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              <FaInfoCircle className="w-4 h-4" />
              <span>About</span>
            </Link>
            {currentUser.curUser && (
              <Link
                to="/mychats"
                className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                <span>My Chats</span>
              </Link>
            )}
            {currentUser.curUser && currentUser.curUser.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                <FaUserShield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            {/* User Profile */}
            <div className="flex items-center">
              {currentUser.curUser ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
                >
                  <img
                    className="w-8 h-8 rounded-full border-2 border-primary-200"
                    src={currentUser.curUser.avatar}
                    alt="profile"
                  />
                  <span className="text-neutral-700 font-medium hidden lg:block">
                    {currentUser.curUser.username}
                    {currentUser.curUser.role === 'admin' && (
                      <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default header
