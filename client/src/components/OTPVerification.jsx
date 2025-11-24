import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function OTPVerification() {
      const [otp, setOtp] = useState(['', '', '', '', '', '']);
      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
      const navigate = useNavigate();
      const [searchParams] = useSearchParams();

      useEffect(() => {
            const emailParam = searchParams.get('email');
            if (emailParam) {
                  setEmail(emailParam);
            } else {
                  navigate('/signup');
            }
      }, [searchParams, navigate]);

      // Countdown timer
      useEffect(() => {
            if (timeLeft <= 0) return;

            const timer = setInterval(() => {
                  setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
      }, [timeLeft]);

      const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      const handleChange = (index, value) => {
            if (!/^\d*$/.test(value)) return; // Only allow digits

            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                  document.getElementById(`otp-${index + 1}`).focus();
            }
      };

      const handleKeyDown = (index, e) => {
            // Handle backspace
            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                  document.getElementById(`otp-${index - 1}`).focus();
            }
      };

      const handlePaste = (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            if (!/^\d+$/.test(pastedData)) return;

            const newOtp = pastedData.split('');
            while (newOtp.length < 6) newOtp.push('');
            setOtp(newOtp);

            // Focus last filled input
            const lastIndex = Math.min(pastedData.length, 5);
            document.getElementById(`otp-${lastIndex}`).focus();
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            const otpString = otp.join('');

            if (otpString.length !== 6) {
                  setError('Please enter all 6 digits');
                  return;
            }

            setLoading(true);
            setError('');

            try {
                  await axios.post('http://localhost:8000/api/verify-otp', {
                        email,
                        otp: otpString
                  });
                  setSuccess('Email verified successfully! Redirecting...');
                  setTimeout(() => navigate('/listings'), 1500);
            } catch (err) {
                  setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
                  setOtp(['', '', '', '', '', '']);
                  document.getElementById('otp-0').focus();
            } finally {
                  setLoading(false);
            }
      };

      const handleResend = async () => {
            setLoading(true);
            setError('');
            setSuccess('');

            try {
                  await axios.post('http://localhost:8000/api/resend-otp', { email });
                  setSuccess('New OTP sent! Please check your email.');
                  setTimeLeft(600); // Reset timer
                  setOtp(['', '', '', '', '', '']);
                  document.getElementById('otp-0').focus();
            } catch (err) {
                  setError(err.response?.data?.error || 'Failed to resend OTP');
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
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                              </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                              Verify Your Email
                        </h1>
                        <p className="text-center text-gray-600 mb-6">
                              We've sent a 6-digit code to<br />
                              <span className="font-semibold text-gray-800">{email}</span>
                        </p>

                        {/* OTP Input */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="flex justify-center gap-2">
                                    {otp.map((digit, index) => (
                                          <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                                autoFocus={index === 0}
                                          />
                                    ))}
                              </div>

                              {/* Timer */}
                              <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                          Time remaining: <span className={`font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-800'}`}>
                                                {formatTime(timeLeft)}
                                          </span>
                                    </p>
                              </div>

                              {/* Error/Success Messages */}
                              {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                          <p className="text-sm text-red-700 text-center">{error}</p>
                                    </div>
                              )}
                              {success && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                          <p className="text-sm text-green-700 text-center">{success}</p>
                                    </div>
                              )}

                              {/* Submit Button */}
                              <button
                                    type="submit"
                                    disabled={loading || otp.join('').length !== 6}
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                              >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                              </button>
                        </form>

                        {/* Resend OTP */}
                        <div className="mt-6 text-center">
                              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                              <button
                                    onClick={handleResend}
                                    disabled={loading || timeLeft > 540} // Can resend after 1 minute
                                    className="text-red-500 hover:text-red-600 font-semibold text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                              >
                                    Resend OTP
                              </button>
                        </div>

                        {/* Back to Signup */}
                        <div className="mt-4 text-center">
                              <a href="/signup" className="text-sm text-gray-600 hover:text-red-500 transition-colors">
                                    ← Back to Signup
                              </a>
                        </div>
                  </div>
            </div>
      );
}

export default OTPVerification;
