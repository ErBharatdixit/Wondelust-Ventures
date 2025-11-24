import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function BookingWidget({ listing }) {
      const [checkIn, setCheckIn] = useState('');
      const [checkOut, setCheckOut] = useState('');
      const { user } = useAuth();
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false);

      const calculateTotal = () => {
            if (!checkIn || !checkOut) return 0;
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays * listing.price;
      };

      const handleBook = async () => {
            if (!user) {
                  navigate('/login');
                  return;
            }
            if (!checkIn || !checkOut) {
                  alert('Please select check-in and check-out dates');
                  return;
            }

            setLoading(true);
            try {
                  const totalPrice = calculateTotal();
                  const { data: order } = await api.post('/bookings/create-order', {
                        listingId: listing._id,
                        checkIn,
                        checkOut,
                        totalPrice
                  });

                  const options = {
                        key: order.keyId,
                        amount: order.amount,
                        currency: order.currency,
                        name: "Wanderlust",
                        description: `Booking for ${listing.title}`,
                        order_id: order.orderId,
                        handler: async function (response) {
                              try {
                                    await api.post('/bookings/verify-payment', {
                                          razorpay_order_id: response.razorpay_order_id,
                                          razorpay_payment_id: response.razorpay_payment_id,
                                          razorpay_signature: response.razorpay_signature,
                                          bookingDetails: {
                                                listingId: listing._id,
                                                checkIn,
                                                checkOut,
                                                totalPrice
                                          }
                                    });
                                    alert('Booking Confirmed!');
                                    navigate('/my-bookings');
                              } catch (error) {
                                    console.error(error);
                                    alert('Payment verification failed');
                              }
                        },
                        prefill: {
                              name: user.username,
                              email: user.email,
                        },
                        theme: {
                              color: "#F43F5E"
                        }
                  };

                  const rzp1 = new window.Razorpay(options);
                  rzp1.open();
            } catch (error) {
                  console.error(error);
                  alert('Error initiating booking');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-bold mb-4">
                        &#8377; {listing.price.toLocaleString("en-IN")} <span className="text-base font-normal text-gray-500">/ night</span>
                  </h3>

                  <div className="flex flex-col gap-4 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                    <label className="text-xs font-bold uppercase text-gray-500 mb-1">Check-in</label>
                                    <input
                                          type="date"
                                          value={checkIn}
                                          onChange={(e) => setCheckIn(e.target.value)}
                                          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                              </div>
                              <div className="flex flex-col">
                                    <label className="text-xs font-bold uppercase text-gray-500 mb-1">Check-out</label>
                                    <input
                                          type="date"
                                          value={checkOut}
                                          onChange={(e) => setCheckOut(e.target.value)}
                                          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                              </div>
                        </div>
                  </div>

                  <button
                        onClick={handleBook}
                        disabled={loading}
                        className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                  >
                        {loading ? 'Processing...' : 'Reserve'}
                  </button>

                  <div className="mt-4 text-center text-gray-500 text-sm">
                        You won't be charged yet
                  </div>

                  {checkIn && checkOut && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>&#8377; {calculateTotal().toLocaleString("en-IN")}</span>
                              </div>
                        </div>
                  )}
            </div>
      );
}

export default BookingWidget;
