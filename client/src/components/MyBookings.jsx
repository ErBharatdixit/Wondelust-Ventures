import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function MyBookings() {
      const [bookings, setBookings] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const fetchBookings = async () => {
                  try {
                        const response = await api.get('/bookings/my-bookings');
                        setBookings(response.data);
                  } catch (error) {
                        console.error('Error fetching bookings:', error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchBookings();
      }, []);

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="container mx-auto px-4 py-8 max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6 text-gray-900">My Bookings</h1>

                        {loading ? (
                              <div className="text-center py-10">Loading...</div>
                        ) : bookings.length === 0 ? (
                              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                                    <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
                                    <Link to="/listings" className="text-red-500 font-bold hover:underline">Explore Listings</Link>
                              </div>
                        ) : (
                              <div className="space-y-4">
                                    {bookings.map((booking) => (
                                          <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded-lg overflow-hidden">
                                                      <img
                                                            src={booking.listing.images && booking.listing.images.length > 0 ? booking.listing.images[0].url : booking.listing.image?.url}
                                                            alt={booking.listing.title}
                                                            className="w-full h-full object-cover"
                                                      />
                                                </div>
                                                <div className="flex-grow flex flex-col justify-between">
                                                      <div>
                                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.listing.title}</h3>
                                                            <p className="text-gray-500 mb-4">{booking.listing.location}, {booking.listing.country}</p>

                                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                                  <div>
                                                                        <p className="text-xs text-gray-400 uppercase font-bold">Check-in</p>
                                                                        <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                                                  </div>
                                                                  <div>
                                                                        <p className="text-xs text-gray-400 uppercase font-bold">Check-out</p>
                                                                        <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                                                                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                                                  }`}>
                                                                  {booking.status}
                                                            </span>
                                                            <span className="text-xl font-bold text-gray-900">
                                                                  &#8377; {booking.totalPrice.toLocaleString("en-IN")}
                                                            </span>
                                                      </div>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
}

export default MyBookings;
