import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function ReviewList({ reviews, onDelete, listingId, onUpdate }) {
      const { user } = useAuth();
      const [editingReviewId, setEditingReviewId] = useState(null);
      const [editComment, setEditComment] = useState('');
      const [editRating, setEditRating] = useState(5);

      const handleEditClick = (review) => {
            setEditingReviewId(review._id);
            setEditComment(review.comment);
            setEditRating(review.rating);
      };

      const handleCancelEdit = () => {
            setEditingReviewId(null);
            setEditComment('');
            setEditRating(5);
      };

      const handleSaveEdit = async (reviewId) => {
            try {
                  await api.put(`/listings/${listingId}/reviews/${reviewId}`, {
                        review: {
                              comment: editComment,
                              rating: editRating
                        }
                  });
                  onUpdate(); // Callback to refresh reviews in parent
                  handleCancelEdit();
            } catch (error) {
                  console.error("Error updating review:", error);
            }
      };

      if (!reviews || reviews.length === 0) {
            return <p className="text-gray-500 italic">No reviews yet.</p>;
      }

      return (
            <div className="space-y-4">
                  {reviews.map(review => (
                        <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <div className="flex justify-between items-start">
                                    <div>
                                          <Link
                                                to={`/profile/${review.author?._id}`}
                                                className="font-semibold text-gray-900 hover:text-red-500 transition"
                                          >
                                                {review.author?.username || 'Anonymous'}
                                          </Link>
                                          {editingReviewId === review._id ? (
                                                <div className="mb-2">
                                                      <div className="flex items-center mb-2 text-xl">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                  <span
                                                                        key={star}
                                                                        className={`cursor-pointer ${star <= editRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                                        onClick={() => setEditRating(star)}
                                                                  >
                                                                        ★
                                                                  </span>
                                                            ))}
                                                      </div>
                                                      <textarea
                                                            value={editComment}
                                                            onChange={(e) => setEditComment(e.target.value)}
                                                            className="w-full p-2 border rounded mb-2"
                                                            rows="3"
                                                      />
                                                      <div className="flex space-x-2">
                                                            <button onClick={() => handleSaveEdit(review._id)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Save</button>
                                                            <button onClick={handleCancelEdit} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm">Cancel</button>
                                                      </div>
                                                </div>
                                          ) : (
                                                <>
                                                      <div className="flex items-center text-yellow-500 text-lg mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                  <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                            ))}
                                                      </div>
                                                      <p className="text-gray-700">{review.comment}</p>
                                                </>
                                          )}
                                    </div>
                                    {user && review.author && String(user._id) === String(review.author._id) && editingReviewId !== review._id && (
                                          <div className="flex space-x-2">
                                                <button
                                                      onClick={() => handleEditClick(review)}
                                                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                >
                                                      Edit
                                                </button>
                                                <button
                                                      onClick={() => onDelete(review._id)}
                                                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                >
                                                      Delete
                                                </button>
                                          </div>
                                    )}
                              </div>
                        </div>
                  ))}
            </div>
      );
}

export default ReviewList;
