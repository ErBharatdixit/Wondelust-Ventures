import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import BookingWidget from './BookingWidget';
import Map from './Map';


function ListingDetail() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [listing, setListing] = useState(null);
      const { user } = useAuth();
      const [isLiked, setIsLiked] = useState(false);
      const [likeCount, setLikeCount] = useState(0);
      const [isFavorited, setIsFavorited] = useState(false);
      const [currentImageIndex, setCurrentImageIndex] = useState(0);

      useEffect(() => {
            const fetchListing = async () => {
                  try {
                        const response = await api.get(`/listings/${id}`);
                        setListing(response.data);
                        setLikeCount(response.data.likes ? response.data.likes.length : 0);
                        if (user && response.data.likes) {
                              setIsLiked(response.data.likes.includes(user._id));
                        }

                        // Check if listing is in favorites
                        if (user) {
                              try {
                                    const favResponse = await api.get('/favorites');
                                    setIsFavorited(favResponse.data.some(fav => fav._id === id));
                              } catch (err) {
                                    console.log('Not logged in or error fetching favorites');
                              }
                        }
                  } catch (error) {
                        console.error('Error fetching listing:', error);
                  }
            };
            fetchListing();
      }, [id, user]);

      const handleFavorite = async () => {
            if (!user) {
                  navigate('/login');
                  return;
            }
            try {
                  await api.post(`/favorites/${id}`);
                  setIsFavorited(!isFavorited);
            } catch (error) {
                  console.error('Error toggling favorite:', error);
            }
      };

      const handleDelete = async () => {
            if (!window.confirm("Are you sure you want to delete this listing?")) return;
            try {
                  await api.delete(`/listings/${id}`);
                  navigate('/listings');
            } catch (error) {
                  console.error('Error deleting listing:', error);
            }
      };

      const handleLike = async () => {
            if (!user) {
                  navigate('/login');
                  return;
            }
            try {
                  const response = await api.post(`/listings/${id}/like`);
                  setLikeCount(response.data.likes.length);
                  setIsLiked(response.data.likes.includes(user._id));
            } catch (error) {
                  console.error('Error liking listing:', error);
            }
      };

      const handleReviewSubmit = async (reviewData) => {
            try {
                  const response = await api.post(`/listings/${id}/reviews`, { review: reviewData });
                  // Refresh listing to get new review with populated author
                  const updatedListingRes = await api.get(`/listings/${id}`);
                  setListing(updatedListingRes.data);
            } catch (error) {
                  console.error('Error submitting review:', error);
            }
      };

      const handleReviewDelete = async (reviewId) => {
            if (!window.confirm("Delete this review?")) return;
            try {
                  await api.delete(`/listings/${id}/reviews/${reviewId}`);
                  setListing(prev => ({
                        ...prev,
                        reviews: prev.reviews.filter(r => r._id !== reviewId)
                  }));
            } catch (error) {
                  console.error('Error deleting review:', error);
            }
      };

      if (!listing) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

      // Admin can edit/delete any listing, OR user must be the owner
      const isOwner = (user && user.isAdmin) || (user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner));

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="container mx-auto px-4 py-8 max-w-4xl">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900">{listing.title}</h1>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
                              <div className="relative group">
                                    {/* Image Carousel */}
                                    <div className="w-full h-[400px] overflow-hidden relative">
                                          {listing.images && listing.images.length > 0 ? (
                                                listing.images.map((img, index) => (
                                                      <div
                                                            key={index}
                                                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                                      >
                                                            <img src={img.url} alt={listing.title} loading="lazy" className="w-full h-full object-cover bg-gray-100" />
                                                      </div>
                                                ))
                                          ) : (
                                                <img src={listing.image?.url} alt={listing.title} loading="lazy" className="w-full h-full object-cover bg-gray-100" />
                                          )}
                                    </div>

                                    {/* Carousel Controls */}
                                    {listing.images && listing.images.length > 1 && (
                                          <>
                                                <button
                                                      onClick={() => setCurrentImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                                                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
                                                >
                                                      ❮
                                                </button>
                                                <button
                                                      onClick={() => setCurrentImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                                                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
                                                >
                                                      ❯
                                                </button>
                                                {/* Indicators */}
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                      {listing.images.map((_, idx) => (
                                                            <button
                                                                  key={idx}
                                                                  onClick={() => setCurrentImageIndex(idx)}
                                                                  className={`w-2 h-2 rounded-full transition ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                                            />
                                                      ))}
                                                </div>
                                          </>
                                    )}

                                    <div className="absolute top-4 right-4 flex gap-2">
                                          <button
                                                onClick={handleLike}
                                                className="bg-white p-3 rounded-full shadow-md hover:scale-110 transition"
                                                title={isLiked ? "Unlike" : "Like"}
                                          >
                                                <span className="text-2xl">{isLiked ? '👍' : '👍🏻'}</span>
                                          </button>
                                          {user && (
                                                <button
                                                      onClick={handleFavorite}
                                                      className="bg-white p-3 rounded-full shadow-md hover:scale-110 transition"
                                                      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                                                >
                                                      <span className="text-2xl">{isFavorited ? '🔖' : '📌'}</span>
                                                </button>
                                          )}
                                    </div>
                              </div>

                              <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                          <div>
                                                <p className="text-xl font-semibold text-gray-900 mb-2">
                                                      Hosted by {listing.owner?.username || 'Unknown'}
                                                </p>
                                                <p className="text-gray-600">
                                                      {listing.location}, {listing.state ? `${listing.state}, ` : ''}{listing.country} {listing.pincode ? `- ${listing.pincode}` : ''}
                                                </p>
                                          </div>
                                          <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">
                                                      &#8377; {listing.price ? listing.price.toLocaleString("en-IN") : 'N/A'}
                                                </p>
                                                <p className="text-gray-500">per night</p>
                                                <div className="flex items-center justify-end mt-1 gap-1">
                                                      <span className="text-yellow-500 text-lg">★</span>
                                                      <span className="font-semibold text-gray-900">{listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}</span>
                                                      <span className="text-sm text-gray-500">({listing.reviewCount || 0} reviews)</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">{likeCount} likes</p>
                                                {user && listing.owner && user._id !== listing.owner._id && (
                                                      <Link
                                                            to={`/chat/${listing.owner._id}`}
                                                            className="mt-4 block w-full text-center py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                                                      >
                                                            Contact Host
                                                      </Link>
                                                )}
                                          </div>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed mb-6">{listing.description}</p>

                                    {isOwner && (
                                          <div className="flex space-x-4 border-t pt-6 mb-8">
                                                <Link
                                                      to={`/listings/${id}/edit`}
                                                      className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                                                >
                                                      Edit
                                                </Link>
                                                <button
                                                      onClick={handleDelete}
                                                      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                                                >
                                                      Delete
                                                </button>
                                          </div>
                                    )}

                                    {/* Map Section */}
                                    <div className="mt-8 mb-8">
                                          <h2 className="text-2xl font-bold mb-4 text-gray-900">Where you'll be</h2>
                                          <Map location={listing.location} coordinates={listing.geometry?.coordinates} />
                                    </div>

                                    {/* Booking Widget */}
                                    <div className="mt-8">
                                          <BookingWidget listing={listing} />
                                    </div>

                                    {/* Reviews Section */}
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Reviews</h2>
                                    {user && <ReviewForm onSubmit={handleReviewSubmit} />}
                                    <ReviewList
                                          reviews={listing.reviews}
                                          onDelete={handleReviewDelete}
                                          listingId={id}
                                          onUpdate={async () => {
                                                const response = await api.get(`/listings/${id}`);
                                                setListing(response.data);
                                          }}
                                    />
                              </div>
                        </div>
                  </div>
            </div>
      );
}

export default ListingDetail;
