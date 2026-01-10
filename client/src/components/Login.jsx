import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function Login() {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const { login, user } = useAuth();
      const navigate = useNavigate();
      const [error, setError] = useState('');

      useEffect(() => {
            if (user) {
                  toast.success("You are already logged in");
                  navigate('/');
            }
      }, [user, navigate]);

      const handleSubmit = async (e) => {
            e.preventDefault();
            const loadingToast = toast.loading('Logging in...');
            try {
                  await login(username, password);
                  toast.success('Welcome back!', { id: loadingToast });
                  navigate('/');
            } catch (err) {
                  // Check if it's a verification error
                  if (err.response?.data?.needsVerification) {
                        toast.error('Please verify your email first', { id: loadingToast });
                        navigate('/verification-pending');
                  } else {
                        toast.error(err.response?.data?.error || 'Invalid username or password', { id: loadingToast });
                  }
            }
      };

      return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
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
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                          type="password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                    />
                              </div>
                              <button
                                    type="submit"
                                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                    Login
                              </button>
                        </form>
                        <p className="text-center text-sm text-gray-600">
                              Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                        </p>
                  </div>
            </div>
      );
}

export default Login;
