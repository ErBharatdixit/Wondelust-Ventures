import { useState } from 'react';

function FilterPanel({ onFilterChange, activeFilters }) {
      const [showFilters, setShowFilters] = useState(false);
      const [filters, setFilters] = useState({
            minPrice: activeFilters?.minPrice || '',
            maxPrice: activeFilters?.maxPrice || '',
            country: activeFilters?.country || '',
            minRating: activeFilters?.minRating || '',
            sort: activeFilters?.sort || 'newest'
      });

      const handleChange = (field, value) => {
            const newFilters = { ...filters, [field]: value };
            setFilters(newFilters);
      };

      const handleApply = () => {
            onFilterChange(filters);
            setShowFilters(false);
      };

      const handleClear = () => {
            const clearedFilters = {
                  minPrice: '',
                  maxPrice: '',
                  country: '',
                  minRating: '',
                  sort: 'newest'
            };
            setFilters(clearedFilters);
            onFilterChange(clearedFilters);
      };

      const activeFilterCount = Object.values(filters).filter(v => v && v !== 'newest').length;

      return (
            <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                        <button
                              onClick={() => setShowFilters(!showFilters)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                        >
                              <span>Filters</span>
                              {activeFilterCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                          {activeFilterCount}
                                    </span>
                              )}
                        </button>

                        <select
                              value={filters.sort}
                              onChange={(e) => {
                                    const newFilters = { ...filters, sort: e.target.value };
                                    setFilters(newFilters);
                                    onFilterChange(newFilters);
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        >
                              <option value="newest">Newest First</option>
                              <option value="price-asc">Price: Low to High</option>
                              <option value="price-desc">Price: High to Low</option>
                              <option value="rating">Highest Rated</option>
                              <option value="popularity">Most Popular</option>
                        </select>
                  </div>

                  {showFilters && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                                          <input
                                                type="number"
                                                value={filters.minPrice}
                                                onChange={(e) => handleChange('minPrice', e.target.value)}
                                                placeholder="₹ 0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                          />
                                    </div>

                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                                          <input
                                                type="number"
                                                value={filters.maxPrice}
                                                onChange={(e) => handleChange('maxPrice', e.target.value)}
                                                placeholder="₹ 100000"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                          />
                                    </div>

                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                          <input
                                                type="text"
                                                value={filters.country}
                                                onChange={(e) => handleChange('country', e.target.value)}
                                                placeholder="e.g. India"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                          />
                                    </div>

                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                                          <select
                                                value={filters.minRating}
                                                onChange={(e) => handleChange('minRating', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                          >
                                                <option value="">Any Rating</option>
                                                <option value="1">1★ & above</option>
                                                <option value="2">2★ & above</option>
                                                <option value="3">3★ & above</option>
                                                <option value="4">4★ & above</option>
                                                <option value="5">5★ only</option>
                                          </select>
                                    </div>
                              </div>

                              <div className="flex gap-2">
                                    <button
                                          onClick={handleApply}
                                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                          Apply Filters
                                    </button>
                                    <button
                                          onClick={handleClear}
                                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                    >
                                          Clear All
                                    </button>
                              </div>
                        </div>
                  )}
            </div>
      );
}

export default FilterPanel;
