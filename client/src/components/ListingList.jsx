import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';
import ListingCardSkeleton from './ListingCardSkeleton';

function ListingList() {
      const [listings, setListings] = useState([]);
      const [loading, setLoading] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [filters, setFilters] = useState({
            minPrice: '',
            maxPrice: '',
            country: '',
            minRating: '',
            sort: 'newest'
      });

      const fetchListings = async () => {
            setLoading(true);
            try {
                  const params = new URLSearchParams();
                  params.append('page', currentPage);
                  if (searchTerm) params.append('search', searchTerm);
                  if (filters.minPrice) params.append('minPrice', filters.minPrice);
                  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                  if (filters.country) params.append('country', filters.country);
                  if (filters.minRating) params.append('minRating', filters.minRating);
                  if (filters.sort) params.append('sort', filters.sort);

                  const response = await api.get(`/listings?${params.toString()}`);

                  if (Array.isArray(response.data)) {
                        setListings(response.data);
                        setTotalPages(1);
                  } else {
                        setListings(response.data.listings);
                        setTotalPages(response.data.totalPages);
                        setCurrentPage(response.data.currentPage);
                  }
            } catch (error) {
                  console.error('Error fetching listings:', error);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchListings();
      }, [searchTerm, filters, currentPage]);

      const handleSearch = (term) => {
            setSearchTerm(term);
            setCurrentPage(1);
      };

      const handleFilterChange = (newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
      };

      const handlePageChange = (page) => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
      };

      const activeFiltersList = [];
      if (searchTerm) activeFiltersList.push({ label: `Search: "${searchTerm}"`, clear: () => setSearchTerm('') });
      if (filters.minPrice) activeFiltersList.push({ label: `Min: ₹${filters.minPrice}`, clear: () => setFilters({ ...filters, minPrice: '' }) });
      if (filters.maxPrice) activeFiltersList.push({ label: `Max: ₹${filters.maxPrice}`, clear: () => setFilters({ ...filters, maxPrice: '' }) });
      if (filters.country) activeFiltersList.push({ label: `Country: ${filters.country}`, clear: () => setFilters({ ...filters, country: '' }) });
      if (filters.minRating) activeFiltersList.push({ label: `${filters.minRating}★ & above`, clear: () => setFilters({ ...filters, minRating: '' }) });

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Listings</h1>

                        <SearchBar onSearch={handleSearch} />
                        <FilterPanel onFilterChange={handleFilterChange} activeFilters={filters} />

                        {activeFiltersList.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-sm text-gray-600 mr-2">Active Filters:</span>
                                    {activeFiltersList.map((filter, idx) => (
                                          <button
                                                key={idx}
                                                onClick={filter.clear}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1 hover:bg-red-200 transition"
                                          >
                                                {filter.label}
                                                <span className="text-xs">✕</span>
                                          </button>
                                    ))}
                              </div>
                        )}

                        {loading ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {[...Array(8)].map((_, idx) => (
                                          <ListingCardSkeleton key={idx} />
                                    ))}
                              </div>
                        ) : listings.length === 0 ? (
                              <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
                                    <button
                                          onClick={() => {
                                                setSearchTerm('');
                                                setFilters({ minPrice: '', maxPrice: '', country: '', minRating: '', sort: 'newest' });
                                          }}
                                          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                          Clear All Filters
                                    </button>
                              </div>
                        ) : (
                              <>
                                    <p className="text-sm text-gray-600 mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                          {listings.map(listing => (
                                                <Link to={`/listings/${listing._id}`} key={listing._id} className="group">
                                                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
                                                            <div className="relative aspect-square">
                                                                  <img
                                                                        src={listing.images && listing.images.length > 0 ? listing.images[0].url : listing.image?.url}
                                                                        alt={listing.title}
                                                                        loading="lazy"
                                                                        className="w-full h-full object-cover bg-gray-100 group-hover:scale-105 transition duration-300"
                                                                  />
                                                            </div>
                                                            <div className="p-4">
                                                                  <h3 className="font-bold text-lg mb-1 truncate text-gray-900">{listing.title}</h3>
                                                                  <p className="text-gray-500 text-sm mb-2">{listing.location}, {listing.country}</p>
                                                                  <div className="flex justify-between items-center">
                                                                        <div className="flex items-baseline">
                                                                              <span className="text-gray-900 font-semibold">
                                                                                    &#8377; {listing.price ? listing.price.toLocaleString("en-IN") : 'N/A'}
                                                                              </span>
                                                                              <span className="text-gray-500 font-normal ml-1">/ night</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-sm">
                                                                              <span className="text-yellow-500">★</span>
                                                                              <span>{listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}</span>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </Link>
                                          ))}
                                    </div>

                                    <Pagination
                                          currentPage={currentPage}
                                          totalPages={totalPages}
                                          onPageChange={handlePageChange}
                                    />
                              </>
                        )}
                  </div>
            </div>
      );
}

export default ListingList;
