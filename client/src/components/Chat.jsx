import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function Chat() {
      const { userId } = useParams(); // ID of the user we are chatting with
      const { user } = useAuth();
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState('');
      const [otherUser, setOtherUser] = useState(null);
      const messagesEndRef = useRef(null);
      const messagesContainerRef = useRef(null);
      const shouldScrollRef = useRef(true);

      const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      const isUserNearBottom = () => {
            if (!messagesContainerRef.current) return true;
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            return scrollHeight - scrollTop - clientHeight < 100; // Within 100px of bottom
      };

      useEffect(() => {
            const fetchConversation = async () => {
                  try {
                        const response = await api.get(`/messages/conversation/${userId}`);
                        const wasNearBottom = isUserNearBottom();
                        setMessages(response.data);

                        // Only auto-scroll if user was already near bottom
                        if (wasNearBottom) {
                              shouldScrollRef.current = true;
                        }

                        // Determine the other user's name from the first message or fetch it if needed
                        // For simplicity, we might need a separate endpoint to get user details if no messages exist
                        // But usually we come here from a listing or inbox where we know the user.
                        // Let's assume we can get it from the messages if they exist.
                        if (response.data.length > 0) {
                              const firstMsg = response.data[0];
                              const other = firstMsg.sender._id === userId ? firstMsg.sender : firstMsg.receiver;
                              setOtherUser(other);
                        }
                  } catch (error) {
                        console.error('Error fetching conversation:', error);
                  }
            };

            if (userId) {
                  fetchConversation();
                  // Polling for new messages every 3 seconds
                  const interval = setInterval(fetchConversation, 3000);
                  return () => clearInterval(interval);
            }
      }, [userId]);

      useEffect(() => {
            if (shouldScrollRef.current) {
                  scrollToBottom();
                  shouldScrollRef.current = false;
            }
      }, [messages]);

      const handleSendMessage = async (e) => {
            e.preventDefault();
            if (!newMessage.trim()) return;

            try {
                  const response = await api.post('/messages', {
                        receiverId: userId,
                        content: newMessage
                  });
                  setMessages([...messages, response.data]);
                  setNewMessage('');
                  shouldScrollRef.current = true; // Always scroll after sending
            } catch (error) {
                  console.error('Error sending message:', error);
            }
      };

      return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Navbar />
                  <div className="flex-grow container mx-auto px-4 py-8 max-w-3xl flex flex-col h-[calc(100vh-64px)]">
                        <div className="bg-white rounded-t-xl shadow-sm p-4 border-b border-gray-200 flex justify-between items-center">
                              <h2 className="text-xl font-bold text-gray-800">
                                    Chat with {otherUser ? otherUser.username : 'User'}
                              </h2>
                        </div>

                        <div ref={messagesContainerRef} className="flex-grow bg-white overflow-y-auto p-4 space-y-4 shadow-sm">
                              {messages.length === 0 ? (
                                    <p className="text-center text-gray-500 mt-10">No messages yet. Say hello!</p>
                              ) : (
                                    messages.map((msg, index) => {
                                          const isMe = msg.sender._id === user._id || msg.sender === user._id;
                                          return (
                                                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-red-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                                            <p>{msg.content}</p>
                                                            <p className={`text-xs mt-1 ${isMe ? 'text-red-100' : 'text-gray-500'}`}>
                                                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                      </div>
                                                </div>
                                          );
                                    })
                              )}
                              <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="bg-white p-4 rounded-b-xl shadow-sm border-t border-gray-200 flex gap-2">
                              <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow px-4 py-2 border rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                              />
                              <button
                                    type="submit"
                                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-md"
                              >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                              </button>
                        </form>
                  </div>
            </div>
      );
}

export default Chat;
