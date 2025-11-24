import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function ListingForm() {
      const { id } = useParams();
      const navigate = useNavigate();
      const { user, loading } = useAuth();
      const isEdit = !!id;

      const [formData, setFormData] = useState({
            title: '',
            description: '',
            images: [], // Changed from image to images array
            imageUrl: '',
            price: '',
            location: '', // city
            country: '',
            state: '',
            pincode: '',
            category: 'Other',
      });
      const [errors, setErrors] = useState({});
      const [previewImages, setPreviewImages] = useState([]);

      // Redirect to login if not authenticated
      useEffect(() => {
            if (!loading && !user) {
                  navigate('/login');
            }
      }, [user, loading, navigate]);

      // Fetch existing listing for edit mode
      useEffect(() => {
            if (isEdit) {
                  const fetchListing = async () => {
                        try {
                              const response = await api.get(`/listings/${id}`);
                              const data = response.data;
                              setFormData({
                                    title: data.title || '',
                                    description: data.description || '',
                                    images: [], // New files
                                    imageUrl: '',
                                    price: data.price || '',
                                    location: data.location || '',
                                    country: data.country || '',
                                    state: data.state || '',
                                    pincode: data.pincode || '',
                                    category: data.category || 'Other',
                              });
                              // Set preview for existing images
                              if (data.images && data.images.length > 0) {
                                    setPreviewImages(data.images.map(img => img.url));
                              } else if (data.image && data.image.url) {
                                    setPreviewImages([data.image.url]);
                              }
                        } catch (error) {
                              console.error('Error fetching listing:', error);
                        }
                  };
                  fetchListing();
            }
      }, [id, isEdit]);

      const handleChange = (e) => {
            const { name, value, files } = e.target;
            if (name === 'images') {
                  const fileList = Array.from(files);
                  setFormData((prev) => ({ ...prev, images: fileList }));

                  // Create previews
                  const newPreviews = fileList.map(file => URL.createObjectURL(file));
                  setPreviewImages(newPreviews);
            } else {
                  setFormData((prev) => ({ ...prev, [name]: value }));
            }
      };

      const validate = () => {
            const newErrors = {};
            if (!formData.title) newErrors.title = 'Title is required';
            if (!formData.description) newErrors.description = 'Description is required';
            if (!formData.price) newErrors.price = 'Price is required';
            if (!formData.country) newErrors.country = 'Country is required';
            if (!formData.state) newErrors.state = 'State is required';
            if (!formData.location) newErrors.location = 'City/Location is required';
            if (!formData.pincode) newErrors.pincode = 'Pincode is required';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validate()) {
                  console.log("Validation failed:", errors);
                  return;
            }
            try {
                  const data = new FormData();
                  data.append('listing[title]', formData.title);
                  data.append('listing[description]', formData.description);
                  data.append('listing[price]', formData.price);
                  data.append('listing[country]', formData.country);
                  data.append('listing[state]', formData.state);
                  data.append('listing[location]', formData.location);
                  data.append('listing[pincode]', formData.pincode);
                  data.append('listing[category]', formData.category);

                  if (formData.images && formData.images.length > 0) {
                        formData.images.forEach(image => {
                              data.append('images', image);
                        });
                  }
                  if (formData.imageUrl) {
                        data.append('listing[imageUrl]', formData.imageUrl);
                  }

                  if (isEdit) {
                        await api.put(`/listings/${id}`, data, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                        });
                  } else {
                        await api.post('/listings', data, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                        });
                  }
                  navigate(isEdit ? `/listings/${id}` : '/listings');
            } catch (error) {
                  console.error('Error saving listing:', error);
            }
      };

      if (loading) return <div>Loading...</div>;

      return (
            <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="container mx-auto px-4 py-8 max-w-2xl">
                        <div className="bg-white rounded-xl shadow-md p-8">
                              <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                                    {isEdit ? 'Edit Listing' : 'Create New Listing'}
                              </h1>
                              <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title */}
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                          <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.title ? 'border-red-500' : ''}`}
                                                required
                                          />
                                          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                    </div>
                                    {/* Description */}
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                          <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="4"
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.description ? 'border-red-500' : ''}`}
                                                required
                                          />
                                          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                    </div>
                                    {/* Image Upload */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Max 5)</label>
                                                <input
                                                      type="file"
                                                      name="images"
                                                      onChange={handleChange}
                                                      accept="image/png, image/jpeg, image/jpg"
                                                      multiple
                                                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                                />
                                                {previewImages.length > 0 && (
                                                      <div className="mt-2 flex gap-2 overflow-x-auto">
                                                            {previewImages.map((src, idx) => (
                                                                  <img key={idx} src={src} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                                                            ))}
                                                      </div>
                                                )}
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Or Image URL</label>
                                                <input
                                                      type="text"
                                                      name="imageUrl"
                                                      value={formData.imageUrl}
                                                      onChange={handleChange}
                                                      placeholder="https://..."
                                                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                                />
                                          </div>
                                    </div>
                                    {/* Country */}
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                          <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.country ? 'border-red-500' : ''}`}
                                                placeholder="Enter country"
                                                required
                                          />
                                          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                    </div>
                                    {/* State and City */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">State/Region *</label>
                                                <input
                                                      type="text"
                                                      name="state"
                                                      value={formData.state}
                                                      onChange={handleChange}
                                                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.state ? 'border-red-500' : ''}`}
                                                      placeholder="Enter state"
                                                      required
                                                />
                                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City/Location *</label>
                                                <input
                                                      type="text"
                                                      name="location"
                                                      value={formData.location}
                                                      onChange={handleChange}
                                                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.location ? 'border-red-500' : ''}`}
                                                      placeholder="Enter city"
                                                      required
                                                />
                                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                          </div>
                                    </div>
                                    {/* Price */}
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                          <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.price ? 'border-red-500' : ''}`}
                                                placeholder="Enter price"
                                                required
                                          />
                                          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                    </div>
                                    {/* Pincode */}
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode/ZIP Code *</label>
                                          <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.pincode ? 'border-red-500' : ''}`}
                                                placeholder="Enter pincode"
                                                required
                                          />
                                          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                                    </div>
                                    {/* Category */}
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                          <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                          >
                                                <option value="Beach">🏖️ Beach</option>
                                                <option value="Mountain">⛰️ Mountain</option>
                                                <option value="City">🏙️ City</option>
                                                <option value="Historic">🏛️ Historic</option>
                                                <option value="Adventure">🎢 Adventure</option>
                                                <option value="Luxury">💎 Luxury</option>
                                                <option value="Nature">🌲 Nature</option>
                                                <option value="Other">📍 Other</option>
                                          </select>
                                    </div>
                                    {/* Submit */}
                                    <button
                                          type="submit"
                                          className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                          {isEdit ? 'Update Listing' : 'Create Listing'}
                                    </button>
                              </form>
                        </div>
                  </div>
            </div>
      );
}

export default ListingForm;
