import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/login"} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">LH</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              LearnHub
            </span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/home"
                className={`${
                  isActive('/')
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600'
                } pb-1 transition-all duration-200 font-medium`}
              >
                Browse Courses
              </Link>
              <Link
                to="/my-courses"
                className={`${
                  isActive('/my-courses')
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600'
                } pb-1 transition-all duration-200 font-medium`}
              >
                My Courses
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;