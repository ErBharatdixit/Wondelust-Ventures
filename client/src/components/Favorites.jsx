import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function Favorites() {
      const { user, loading } = useAuth();
      const [favorites, setFavorites] = useState([]);
      const [loadingFavorites, setLoadingFavorites] = useState(true);

      useEffect(() => {
            if (!loading && user) {
                  fetchFavorites();
            }
      }, [user, loading]);

      const fetchFavorites = async () => {
            try {
                  const response = await api.get('/favorites');
                  setFavorites(response.data);
            } catch (error) {
                  console.error('Error fetching favorites:', error);
            } finally {
                  setLoadingFavorites(false);
            }
      };

      const handleRemoveFavorite = async (listingId) => {
            try {
                  await api.post(`/favorites/${listingId}`);
                  setFavorites(favorites.filter(fav => fav._id !== listingId));
            } catch (error) {
                  console.error('Error removing favorite:', error);
            }
      };

      if (loading || loadingFavorites) {
            return (
                  <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <div className="container mx-auto px-4 py-8">
                              <p className="text-center text-gray-500">Loading...</p>
                        </div>
                  </div>
            );
      }

      if (!user) {
            return (
                  <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <div className="container mx-auto px-4 py-8">
                              <p className="text-center text-gray-500">Please login to view favorites</p>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Favorites ❤️</h1>

                        {favorites.length === 0 ? (
                              <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-4">You haven't added any favorites yet</p>
                                    <Link
                                          to="/listings"
                                          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition inline-block"
                                    >
                                          Browse Listings
                                    </Link>
                              </div>
                        ) : (
                              <>
                                    <p className="text-sm text-gray-600 mb-4">{favorites.length} favorite{favorites.length !== 1 ? 's' : ''}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                          {favorites.map(listing => (
                                                <div key={listing._id} className="relative group">
                                                      <Link to={`/listings/${listing._id}`} className="block">
                                                            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
                                                                  <div className="relative aspect-square">
                                                                        <img
                                                                              src={listing.image?.url}
                                                                              alt={listing.title}
                                                                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                                        />
                                                                  </div>
                                                                  <div className="p-4">
                                                                        <h3 className="font-bold text-lg mb-1 truncate text-gray-900">{listing.title}</h3>
                                                                        <p className="text-gray-500 text-sm mb-2">{listing.location}, {listing.country}</p>
                                                                        <div className="flex items-baseline">
                                                                              <span className="text-gray-900 font-semibold">
                                                                                    &#8377; {listing.price ? listing.price.toLocaleString("en-IN") : 'N/A'}
                                                                              </span>
                                                                              <span className="text-gray-500 font-normal ml-1">/ night</span>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </Link>
                                                      <button
                                                            onClick={() => handleRemoveFavorite(listing._id)}
                                                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                                                            title="Remove from favorites"
                                                      >
                                                            <span className="text-red-500 text-xl">❤️</span>
                                                      </button>
                                                </div>
                                          ))}
                                    </div>
                              </>
                        )}
                  </div>
            </div>
      );
}

export default Favorites;
