import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { useState, useRef, useEffect } from 'react';

function Navbar() {
      const { user, logout } = useAuth();
      const navigate = useNavigate();
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const dropdownRef = useRef(null);

      const handleLogout = async () => {
            await logout();
            navigate('/');
      };

      // Close dropdown when clicking outside
      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsDropdownOpen(false);
                  }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      return (
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                  <div className="container mx-auto px-6">
                        <div className="flex justify-between items-center h-20">
                              {/* Logo */}
                              <Link to="/" className="flex items-center space-x-2 group">
                                    <div className="text-3xl text-red-500 group-hover:scale-110 transition-transform">
                                          <i className="fa-regular fa-compass"></i>
                                    </div>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                          Wanderlust
                                    </span>
                              </Link>

                              {/* Desktop Navigation */}
                              <div className="hidden lg:flex items-center space-x-8">
                                    <Link
                                          to="/"
                                          className="text-gray-700 hover:text-red-500 font-medium transition-colors text-sm tracking-wide"
                                    >
                                          Explore
                                    </Link>

                                    {user && (
                                          <>
                                                <Link
                                                      to="/favorites"
                                                      className="text-gray-700 hover:text-red-500 font-medium transition-colors text-sm tracking-wide flex items-center gap-1.5"
                                                      title="Favorites"
                                                >
                                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                      </svg>
                                                      <span>Favorites</span>
                                                </Link>

                                                <Link
                                                      to="/inbox"
                                                      className="text-gray-700 hover:text-red-500 font-medium transition-colors text-sm tracking-wide flex items-center gap-1.5"
                                                      title="Messages"
                                                >
                                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                      </svg>
                                                      <span>Messages</span>
                                                </Link>

                                                <Link
                                                      to="/my-bookings"
                                                      className="text-gray-700 hover:text-red-500 font-medium transition-colors text-sm tracking-wide flex items-center gap-1.5"
                                                      title="Bookings"
                                                >
                                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                      </svg>
                                                      <span>Bookings</span>
                                                </Link>

                                                <NotificationDropdown />
                                          </>
                                    )}

                                    {/* Right Side Actions */}
                                    {!user ? (
                                          <div className="flex items-center space-x-4">
                                                <Link
                                                      to="/login"
                                                      className="text-gray-700 hover:text-red-500 font-semibold transition-colors text-sm tracking-wide"
                                                >
                                                      Log in
                                                </Link>
                                                <Link
                                                      to="/signup"
                                                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm tracking-wide"
                                                >
                                                      Sign up
                                                </Link>
                                          </div>
                                    ) : (
                                          <div className="flex items-center space-x-4">
                                                <Link
                                                      to="/listings/new"
                                                      className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors text-sm tracking-wide"
                                                >
                                                      + Create Listing
                                                </Link>

                                                {/* User Dropdown */}
                                                <div className="relative" ref={dropdownRef}>
                                                      <button
                                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                      >
                                                            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                  {user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <svg
                                                                  className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  viewBox="0 0 24 24"
                                                            >
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                      </button>

                                                      {/* Dropdown Menu */}
                                                      {isDropdownOpen && (
                                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                                                                  <div className="px-4 py-3 border-b border-gray-100">
                                                                        <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                                  </div>

                                                                  <Link
                                                                        to={`/profile/${user._id}`}
                                                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                                        onClick={() => setIsDropdownOpen(false)}
                                                                  >
                                                                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                        </svg>
                                                                        View Profile
                                                                  </Link>

                                                                  <button
                                                                        onClick={() => {
                                                                              handleLogout();
                                                                              setIsDropdownOpen(false);
                                                                        }}
                                                                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                                  >
                                                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                                        </svg>
                                                                        Log out
                                                                  </button>
                                                            </div>
                                                      )}
                                                </div>
                                          </div>
                                    )}
                              </div>

                              {/* Mobile Menu Button */}
                              <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          {isMobileMenuOpen ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                          )}
                                    </svg>
                              </button>
                        </div>
                  </div>

                  {/* Mobile Menu */}
                  {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-gray-100 bg-white">
                              <div className="container mx-auto px-6 py-4 space-y-3">
                                    <Link
                                          to="/"
                                          className="block py-2 text-gray-700 hover:text-red-500 font-medium"
                                          onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                          Explore
                                    </Link>

                                    {user ? (
                                          <>
                                                <Link
                                                      to="/listings/new"
                                                      className="block py-2 text-gray-700 hover:text-red-500 font-medium"
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                      Create Listing
                                                </Link>
                                                <Link
                                                      to="/favorites"
                                                      className="block py-2 text-gray-700 hover:text-red-500 font-medium"
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                      Favorites
                                                </Link>
                                                <Link
                                                      to="/inbox"
                                                      className="block py-2 text-gray-700 hover:text-red-500 font-medium"
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                      Messages
                                                </Link>
                                                <Link
                                                      to="/my-bookings"
                                                      className="block py-2 text-gray-700 hover:text-red-500 font-medium"
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                      My Bookings
                                                </Link>
                                                <Link
                                                      to={`/profile/${user._id}`}
                                                      className="block py-2 text-gray-700 hover:text-red-500 font-medium"
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                      Profile
                                                </Link>
                                                <button
                                                      onClick={() => {
                                                            handleLogout();
                                                            setIsMobileMenuOpen(false);
                                                      }}
                                                      className="block w-full text-left py-2 text-red-600 font-medium"
                                                >
                                                      Log out
                                                </button>
                                          </>
                                    ) : (
                                          <>
                                                <Link
                                                      to="/login"
                                                      className="block py-2 text-gray-700 hover:text-red-500 font-medium"
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                      Log in
                                                </Link>
                                                <Link
                                                      to="/signup"
                                                      className="block py-2 px-5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full text-center"
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                      Sign up
                                                </Link>
                                          </>
                                    )}
                              </div>
                        </div>
                  )}
            </nav>
      );
}

export default Navbar;
