import { useState } from 'react';

function ReviewForm({ onSubmit }) {
      const [rating, setRating] = useState(5);
      const [hoverRating, setHoverRating] = useState(0);
      const [comment, setComment] = useState('');

      const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit({ rating, comment });
            setRating(5);
            setComment('');
      };

      return (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Leave a Review</h3>
                  <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                          key={star}
                                          type="button"
                                          onClick={() => setRating(star)}
                                          onMouseEnter={() => setHoverRating(star)}
                                          onMouseLeave={() => setHoverRating(0)}
                                          className={`text-2xl focus:outline-none transition transform hover:scale-110 ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                          ★
                                    </button>
                              ))}
                        </div>
                  </div>
                  <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows="3"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                              required
                        ></textarea>
                  </div>
                  <button
                        type="submit"
                        className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition"
                  >
                        Submit Review
                  </button>
            </form>
      );
}

export default ReviewForm;
