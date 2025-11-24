import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PasswordStrength from './PasswordStrength';

function Signup() {
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [requestAdmin, setRequestAdmin] = useState(false);
      const { signup } = useAuth();
      const navigate = useNavigate();
      const [error, setError] = useState('');

      const handleSubmit = async (e) => {
            e.preventDefault();
            const loadingToast = toast.loading('Creating account...');
            try {
                  await signup(username, email, password, requestAdmin);
                  toast.success('Account created! Check your email for OTP', { id: loadingToast });
                  // Redirect to OTP verification with email
                  navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
            } catch (err) {
                  toast.error(err.response?.data?.error || 'Failed to create account', { id: loadingToast });
            }
      };

      return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                        <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                          type="text"
                                          value={username}
                                          onChange={(e) => setUsername(e.target.value)}
                                          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                          type="email"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                          type="password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                          minLength={8}
                                    />
                                    <PasswordStrength password={password} />
                              </div>
                              <div className="flex items-center">
                                    <input
                                          type="checkbox"
                                          id="requestAdmin"
                                          checked={requestAdmin}
                                          onChange={(e) => setRequestAdmin(e.target.checked)}
                                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="requestAdmin" className="ml-2 text-sm text-gray-700">
                                          Request Admin Access (requires approval)
                                    </label>
                              </div>
                              <button
                                    type="submit"
                                    className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                              >
                                    Sign Up
                              </button>
                        </form>
                        <p className="text-center text-sm text-gray-600">
                              Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                        </p>
                  </div>
            </div>
      );
}

export default Signup;
