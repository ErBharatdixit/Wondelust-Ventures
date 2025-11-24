import { useState } from 'react';

function SearchBar({ onSearch }) {
      const [searchTerm, setSearchTerm] = useState('');

      const handleSubmit = (e) => {
            e.preventDefault();
            onSearch(searchTerm);
      };

      const handleClear = () => {
            setSearchTerm('');
            onSearch('');
      };

      return (
            <form onSubmit={handleSubmit} className="mb-6">
                  <div className="flex gap-3">
                        <div className="flex-1 relative">
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                              </div>
                              <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by title, location, or description..."
                                    className="w-full pl-12 pr-10 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none shadow-sm hover:shadow-md transition-shadow bg-white"
                              />
                              {searchTerm && (
                                    <button
                                          type="button"
                                          onClick={handleClear}
                                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                    </button>
                              )}
                        </div>
                        <button
                              type="submit"
                              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                              Search
                        </button>
                  </div>
            </form>
      );
}

export default SearchBar;
