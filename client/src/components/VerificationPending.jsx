import { useState } from 'react';
import api from '../api';

function VerificationPending() {
      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState('');

      const handleResend = async (e) => {
            e.preventDefault();
            setLoading(true);
            setMessage('');

            try {
                  await api.post('/resend-verification', { email });
                  setMessage('Verification email sent! Please check your inbox.');
            } catch (error) {
                  setMessage(error.response?.data?.error || 'Failed to send verification email');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-red-600 flex items-center justify-center px-4">
                  <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                              </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                              Verify Your Email
                        </h1>

                        {/* Description */}
                        <p className="text-center text-gray-600 mb-6">
                              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                        </p>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                              <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-700">
                                          <p className="font-semibold mb-1">Didn't receive the email?</p>
                                          <ul className="list-disc list-inside space-y-1 text-blue-600">
                                                <li>Check your spam/junk folder</li>
                                                <li>Make sure you entered the correct email</li>
                                                <li>Wait a few minutes for the email to arrive</li>
                                          </ul>
                                    </div>
                              </div>
                        </div>

                        {/* Resend Form */}
                        <form onSubmit={handleResend} className="space-y-4">
                              <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                          Email Address
                                    </label>
                                    <input
                                          type="email"
                                          id="email"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          placeholder="Enter your email"
                                          required
                                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    />
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                    {loading ? 'Sending...' : 'Resend Verification Email'}
                              </button>
                        </form>

                        {/* Message */}
                        {message && (
                              <div className={`mt-4 p-4 rounded-xl ${message.includes('sent') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    <p className="text-sm text-center">{message}</p>
                              </div>
                        )}

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                              <a href="/login" className="text-sm text-gray-600 hover:text-red-500 transition-colors">
                                    ← Back to Login
                              </a>
                        </div>
                  </div>
            </div>
      );
}

export default VerificationPending;
