import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

function Home() {
      const [trendingListings, setTrendingListings] = useState([]);

      useEffect(() => {
            const fetchTrending = async () => {
                  try {
                        console.log('Fetching trending listings...');
                        const response = await api.get('/listings/trending');
                        console.log('Trending listings response:', response.data);
                        console.log('Number of listings:', response.data.length);
                        setTrendingListings(response.data);
                  } catch (error) {
                        console.error('Error fetching trending listings:', error);
                        console.error('Error response:', error.response?.data);
                  }
            };
            fetchTrending();
      }, []);

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />

                  {/* Hero Section */}
                  <div className="relative bg-gradient-to-br from-red-500 via-pink-500 to-red-600 text-white py-32 overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                              <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <div className="container mx-auto px-6 relative z-10">
                              <div className="max-w-4xl mx-auto text-center">
                                    <h1 className="text-6xl font-bold mb-4 leading-tight">
                                          Find your next adventure
                                    </h1>
                                    <p className="text-xl mb-12 text-white/90">
                                          Discover unique homes and experiences around the world.
                                    </p>

                                    {/* Search Box */}
                                    <div className="bg-white rounded-2xl shadow-2xl p-3 max-w-3xl mx-auto">
                                          <div className="flex flex-col md:flex-row gap-3">
                                                <input
                                                      type="text"
                                                      placeholder="Where do you want to go?"
                                                      className="flex-1 px-6 py-4 text-gray-800 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                                                />
                                                <Link
                                                      to="/listings"
                                                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-center whitespace-nowrap"
                                                >
                                                      🔍 Explore
                                                </Link>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Trending Section */}
                  <div className="container mx-auto px-4 py-12">
                        <h2 className="text-3xl font-bold mb-8 text-gray-800">Trending Top 3</h2>
                        {trendingListings.length === 0 ? (
                              <p className="text-center text-gray-500 py-8">No trending listings available yet. Be the first to create one!</p>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {trendingListings.map(listing => (
                                          <Link to={`/listings/${listing._id}`} key={listing._id} className="group">
                                                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                                                      <div className="relative aspect-[4/3]">
                                                            <img
                                                                  src={listing.images && listing.images.length > 0 ? listing.images[0].url : listing.image?.url}
                                                                  alt={listing.title}
                                                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                            />
                                                            <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                                                  <i className="fa-solid fa-star text-yellow-400 mr-1"></i>
                                                                  {listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}
                                                            </div>
                                                      </div>
                                                      <div className="p-4">
                                                            <h3 className="font-bold text-lg mb-1 truncate">{listing.title}</h3>
                                                            <p className="text-gray-500 text-sm mb-2">{listing.location}, {listing.country}</p>
                                                            <p className="text-gray-900 font-semibold">
                                                                  &#8377; {listing.price ? listing.price.toLocaleString("en-IN") : 'N/A'}
                                                                  <span className="text-gray-500 font-normal"> / night</span>
                                                            </p>
                                                      </div>
                                                </div>
                                          </Link>
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
}

export default Home;
