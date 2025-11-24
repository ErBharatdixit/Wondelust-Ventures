import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function Inbox() {
      const [conversations, setConversations] = useState([]);
      const { user } = useAuth();

      useEffect(() => {
            const fetchInbox = async () => {
                  try {
                        const response = await api.get('/messages/inbox');
                        setConversations(response.data);
                  } catch (error) {
                        console.error('Error fetching inbox:', error);
                  }
            };

            fetchInbox();
      }, []);

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="container mx-auto px-4 py-8 max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6 text-gray-900">Inbox</h1>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                              {conversations.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                          <p>You don't have any messages yet.</p>
                                    </div>
                              ) : (
                                    <div className="divide-y divide-gray-100">
                                          {conversations.map((conv) => (
                                                <Link
                                                      to={`/chat/${conv.user._id}`}
                                                      key={conv.user._id}
                                                      className="block p-6 hover:bg-gray-50 transition"
                                                >
                                                      <div className="flex justify-between items-start">
                                                            <div className="flex gap-4">
                                                                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-bold text-xl">
                                                                        {conv.user.username[0].toUpperCase()}
                                                                  </div>
                                                                  <div>
                                                                        <h3 className="font-semibold text-gray-900">{conv.user.username}</h3>
                                                                        {conv.listing && (
                                                                              <p className="text-xs text-gray-500 mb-1">Re: {conv.listing.title}</p>
                                                                        )}
                                                                        <p className="text-gray-600 text-sm truncate max-w-md">
                                                                              {conv.lastMessage.sender === user._id ? 'You: ' : ''}
                                                                              {conv.lastMessage.content}
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                            <span className="text-xs text-gray-400">
                                                                  {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                                                            </span>
                                                      </div>
                                                </Link>
                                          ))}
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      );
}

export default Inbox;
