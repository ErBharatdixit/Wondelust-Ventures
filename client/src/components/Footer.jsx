import React from 'react';

function Footer() {
      return (
            <footer className="bg-gray-900 text-gray-300 mt-auto">
                  <div className="container mx-auto px-6 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                              {/* About Section */}
                              <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                          <i className="fa-regular fa-compass text-3xl text-red-500"></i>
                                          <h3 className="text-2xl font-bold text-white">Wanderlust</h3>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                          Discover unique homes and experiences around the world. Your next adventure awaits!
                                    </p>
                              </div>

                              {/* Quick Links */}
                              <div>
                                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                                    <ul className="space-y-2 text-sm">
                                          <li>
                                                <a href="/" className="hover:text-red-500 transition-colors">Home</a>
                                          </li>
                                          <li>
                                                <a href="/listings" className="hover:text-red-500 transition-colors">Explore Listings</a>
                                          </li>
                                          <li>
                                                <a href="/listings/new" className="hover:text-red-500 transition-colors">List Your Property</a>
                                          </li>
                                          <li>
                                                <a href="/favorites" className="hover:text-red-500 transition-colors">Favorites</a>
                                          </li>
                                    </ul>
                              </div>

                              {/* Contact Us */}
                              <div>
                                    <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                                    <ul className="space-y-3 text-sm">
                                          <li className="flex items-center space-x-2">
                                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href="mailto:WanderLust010703@gmail.com" className="hover:text-red-500 transition-colors break-all">
                                                      WanderLust010703@gmail.com
                                                </a>
                                          </li>
                                          <li className="flex items-center space-x-2">
                                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <a href="tel:+917068876861" className="hover:text-red-500 transition-colors">
                                                      +91 7068876861
                                                </a>
                                          </li>
                                          <li className="flex items-start space-x-2">
                                                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-gray-400">
                                                      Matura, Uttar Pradesh, India
                                                </span>
                                          </li>
                                    </ul>
                              </div>

                              {/* Social Media */}
                              <div>
                                    <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                                    <div className="flex flex-wrap gap-4">
                                          {/* Instagram */}
                                          <a
                                                href="https://www.instagram.com/panditbharatdixit/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center space-y-1 group"
                                                title="Instagram"
                                          >
                                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/50">
                                                      <i className="fab fa-instagram text-white text-3xl"></i>
                                                </div>
                                                <span className="text-xs text-gray-400 group-hover:text-pink-400 transition-colors">Instagram</span>
                                          </a>

                                          {/* Facebook */}
                                          <a
                                                href="https://www.facebook.com/bharat.dixit.5872/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center space-y-1 group"
                                                title="Facebook"
                                          >
                                                <div className="w-14 h-14 bg-[#1877F2] rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
                                                      <i className="fab fa-facebook-f text-white text-3xl"></i>
                                                </div>
                                                <span className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">Facebook</span>
                                          </a>

                                          {/* LinkedIn */}
                                          <a
                                                href="https://www.linkedin.com/in/bharat-dixit-8a3555296/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center space-y-1 group"
                                                title="LinkedIn"
                                          >
                                                <div className="w-14 h-14 bg-[#0A66C2] rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-600/50">
                                                      <i className="fab fa-linkedin-in text-white text-3xl"></i>
                                                </div>
                                                <span className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">LinkedIn</span>
                                          </a>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-6">
                                          Stay connected for updates and exclusive offers!
                                    </p>
                              </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                              <p className="text-sm text-gray-400">
                                    © {new Date().getFullYear()} Wanderlust. All rights reserved.
                              </p>
                              <p className="text-sm text-gray-400 flex items-center">
                                    Created with <span className="text-red-500 mx-1 text-lg">❤️</span> by
                                    <span className="font-bold text-white ml-1">Bharat Dixit</span>
                              </p>
                        </div>
                  </div>
            </footer>
      );
}

export default Footer;
