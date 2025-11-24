import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function UserProfile() {
      const { id } = useParams();
      const { user: currentUser } = useAuth();
      const [profile, setProfile] = useState(null);
      const [listings, setListings] = useState([]);
      const [reviews, setReviews] = useState([]);
      const [activeTab, setActiveTab] = useState('listings');
      const [loading, setLoading] = useState(true);
      const [isEditing, setIsEditing] = useState(false);
      const [editForm, setEditForm] = useState({ username: '', email: '', bio: '' });

      const isOwnProfile = currentUser && currentUser._id === id;

      useEffect(() => {
            fetchProfile();
            fetchListings();
            fetchReviews();
      }, [id]);

      const fetchProfile = async () => {
            try {
                  const response = await api.get(`/users/${id}`);
                  setProfile(response.data);
                  setEditForm({
                        username: response.data.user.username,
                        email: response.data.user.email,
                        bio: response.data.user.bio || '',
                        profilePicturePreview: response.data.user.profilePicture?.url
                  });
            } catch (error) {
                  console.error('Error fetching profile:', error);
            } finally {
                  setLoading(false);
            }
      };

      const fetchListings = async () => {
            try {
                  const response = await api.get(`/users/${id}/listings`);
                  setListings(response.data);
            } catch (error) {
                  console.error('Error fetching listings:', error);
            }
      };

      const fetchReviews = async () => {
            try {
                  const response = await api.get(`/users/${id}/reviews`);
                  setReviews(response.data);
            } catch (error) {
                  console.error('Error fetching reviews:', error);
            }
      };

      const handleUpdateProfile = async (e) => {
            e.preventDefault();
            try {
                  const formData = new FormData();
                  formData.append('username', editForm.username);
                  formData.append('email', editForm.email);
                  formData.append('bio', editForm.bio);
                  if (editForm.profilePicture) {
                        formData.append('profilePicture', editForm.profilePicture);
                  }

                  await api.put(`/users/${id}`, formData, {
                        headers: {
                              'Content-Type': 'multipart/form-data'
                        }
                  });
                  fetchProfile();
                  setIsEditing(false);
            } catch (error) {
                  console.error('Error updating profile:', error);
            }
      };

      if (loading) {
            return (
                  <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <div className="container mx-auto px-4 py-8">
                              <p className="text-center text-gray-500">Loading profile...</p>
                        </div>
                  </div>
            );
      }

      if (!profile) {
            return (
                  <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <div className="container mx-auto px-4 py-8">
                              <p className="text-center text-gray-500">Profile not found</p>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="container mx-auto px-4 py-8">
                        {/* Profile Header */}
                        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                              <div className="flex justify-between items-start">
                                    <div>
                                          {isEditing ? (
                                                <form onSubmit={handleUpdateProfile} className="space-y-4" encType="multipart/form-data">
                                                      <div className="flex flex-col items-center mb-4">
                                                            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-200">
                                                                  {editForm.profilePicturePreview ? (
                                                                        <img src={editForm.profilePicturePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                                                  ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                                                                              {editForm.username.charAt(0).toUpperCase()}
                                                                        </div>
                                                                  )}
                                                            </div>
                                                            <label className="cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium">
                                                                  Change Photo
                                                                  <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        onChange={(e) => {
                                                                              const file = e.target.files[0];
                                                                              if (file) {
                                                                                    setEditForm({
                                                                                          ...editForm,
                                                                                          profilePicture: file,
                                                                                          profilePicturePreview: URL.createObjectURL(file)
                                                                                    });
                                                                              }
                                                                        }}
                                                                  />
                                                            </label>
                                                      </div>
                                                      <div>
                                                            <label className="block text-sm font-medium mb-1">Username</label>
                                                            <input
                                                                  type="text"
                                                                  value={editForm.username}
                                                                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                                                  className="w-full px-3 py-2 border rounded-lg"
                                                            />
                                                      </div>
                                                      <div>
                                                            <label className="block text-sm font-medium mb-1">Email</label>
                                                            <input
                                                                  type="email"
                                                                  value={editForm.email}
                                                                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                                  className="w-full px-3 py-2 border rounded-lg"
                                                            />
                                                      </div>
                                                      <div>
                                                            <label className="block text-sm font-medium mb-1">Bio</label>
                                                            <textarea
                                                                  value={editForm.bio}
                                                                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                                  className="w-full px-3 py-2 border rounded-lg"
                                                                  rows="3"
                                                            />
                                                      </div>
                                                      <div className="flex gap-2">
                                                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
                                                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                                      </div>
                                                </form>
                                          ) : (
                                                <>
                                                      <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                                                                  {profile.user.profilePicture?.url ? (
                                                                        <img src={profile.user.profilePicture.url} alt={profile.user.username} className="w-full h-full object-cover" />
                                                                  ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                                                                              {profile.user.username.charAt(0).toUpperCase()}
                                                                        </div>
                                                                  )}
                                                            </div>
                                                            <div>
                                                                  <h1 className="text-3xl font-bold text-gray-900">{profile.user.username}</h1>
                                                                  <p className="text-gray-600">{profile.user.email}</p>
                                                            </div>
                                                      </div>
                                                      {profile.user.bio && <p className="text-gray-700 mb-4">{profile.user.bio}</p>}
                                                      {isOwnProfile && (
                                                            <button
                                                                  onClick={() => setIsEditing(true)}
                                                                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                            >
                                                                  Edit Profile
                                                            </button>
                                                      )}
                                                </>
                                          )}
                                    </div>

                                    {/* Statistics */}
                                    <div className="grid grid-cols-3 gap-6 text-center">
                                          <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-2xl font-bold text-gray-900">{profile.stats.listingsCount}</p>
                                                <p className="text-sm text-gray-600">Listings</p>
                                          </div>
                                          <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-2xl font-bold text-gray-900">{profile.stats.reviewsCount}</p>
                                                <p className="text-sm text-gray-600">Reviews</p>
                                          </div>
                                          <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-2xl font-bold text-yellow-500">{profile.stats.averageRating || 'N/A'}</p>
                                                <p className="text-sm text-gray-600">Avg Rating</p>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                              <div className="flex border-b">
                                    <button
                                          onClick={() => setActiveTab('listings')}
                                          className={`flex-1 py-4 px-6 font-semibold ${activeTab === 'listings' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                          Listings ({listings.length})
                                    </button>
                                    <button
                                          onClick={() => setActiveTab('reviews')}
                                          className={`flex-1 py-4 px-6 font-semibold ${activeTab === 'reviews' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                          Reviews ({reviews.length})
                                    </button>
                              </div>

                              <div className="p-6">
                                    {activeTab === 'listings' && (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {listings.length === 0 ? (
                                                      <p className="text-gray-500 col-span-full text-center">No listings yet</p>
                                                ) : (
                                                      listings.map(listing => (
                                                            <Link key={listing._id} to={`/listings/${listing._id}`} className="group">
                                                                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition">
                                                                        <img src={listing.image?.url} alt={listing.title} className="w-full h-40 object-cover" />
                                                                        <div className="p-3">
                                                                              <h3 className="font-semibold truncate">{listing.title}</h3>
                                                                              <p className="text-sm text-gray-600">{listing.location}</p>
                                                                              <p className="text-sm font-semibold mt-1">₹{listing.price?.toLocaleString('en-IN')}</p>
                                                                        </div>
                                                                  </div>
                                                            </Link>
                                                      ))
                                                )}
                                          </div>
                                    )}

                                    {activeTab === 'reviews' && (
                                          <div className="space-y-4">
                                                {reviews.length === 0 ? (
                                                      <p className="text-gray-500 text-center">No reviews yet</p>
                                                ) : (
                                                      reviews.map(review => (
                                                            <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                                                                  <div className="flex items-center text-yellow-500 text-sm mb-2">
                                                                        {[...Array(5)].map((_, i) => (
                                                                              <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                                        ))}
                                                                  </div>
                                                                  <p className="text-gray-700">{review.comment}</p>
                                                                  <p className="text-xs text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                      ))
                                                )}
                                          </div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      );
}

export default UserProfile;
