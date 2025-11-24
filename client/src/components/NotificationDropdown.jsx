import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function NotificationDropdown() {
      const [notifications, setNotifications] = useState([]);
      const [unreadCount, setUnreadCount] = useState(0);
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef(null);

      useEffect(() => {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
      }, []);

      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsOpen(false);
                  }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      const fetchNotifications = async () => {
            try {
                  const response = await api.get('/notifications');
                  setNotifications(response.data);
                  setUnreadCount(response.data.filter(n => !n.read).length);
            } catch (error) {
                  console.error('Error fetching notifications:', error);
            }
      };

      const markAsRead = async (id) => {
            try {
                  await api.put(`/notifications/${id}/read`);
                  setNotifications(notifications.map(n =>
                        n._id === id ? { ...n, read: true } : n
                  ));
                  setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                  console.error('Error marking notification as read:', error);
            }
      };

      const handleNotificationClick = async (notification) => {
            if (!notification.read) {
                  await markAsRead(notification._id);
            }
            setIsOpen(false);
      };

      const getNotificationLink = (notification) => {
            switch (notification.type) {
                  case 'booking_request':
                  case 'booking_confirmed':
                        return '/bookings/my-bookings'; // Or a specific booking detail page if available
                  case 'message':
                        return `/chat/${notification.sender._id}`;
                  case 'review':
                        return `/listings/${notification.relatedId}`; // Assuming relatedId is listing ID for reviews
                  default:
                        return '#';
            }
      };

      return (
            <div className="relative" ref={dropdownRef}>
                  <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative p-2 text-gray-600 hover:text-red-500 transition"
                  >
                        <span className="text-xl">🔔</span>
                        {unreadCount > 0 && (
                              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                              </span>
                        )}
                  </button>

                  {isOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                              <div className="p-4 border-b bg-gray-50">
                                    <h3 className="font-bold text-gray-900">Notifications</h3>
                              </div>
                              <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                          <div className="p-4 text-center text-gray-500">
                                                No notifications
                                          </div>
                                    ) : (
                                          notifications.map(notification => (
                                                <Link
                                                      key={notification._id}
                                                      to={getNotificationLink(notification)}
                                                      onClick={() => handleNotificationClick(notification)}
                                                      className={`block p-4 border-b hover:bg-gray-50 transition ${!notification.read ? 'bg-blue-50' : ''}`}
                                                >
                                                      <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                                  {notification.sender?.profilePicture?.url ? (
                                                                        <img src={notification.sender.profilePicture.url} alt="" className="w-full h-full object-cover" />
                                                                  ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                                                              {notification.sender?.username?.charAt(0).toUpperCase() || '?'}
                                                                        </div>
                                                                  )}
                                                            </div>
                                                            <div>
                                                                  <p className="text-sm text-gray-900">{notification.message}</p>
                                                                  <p className="text-xs text-gray-500 mt-1">
                                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                                  </p>
                                                            </div>
                                                      </div>
                                                </Link>
                                          ))
                                    )}
                              </div>
                        </div>
                  )}
            </div>
      );
}

export default NotificationDropdown;
