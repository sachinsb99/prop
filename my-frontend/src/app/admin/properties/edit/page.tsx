// app/admin/properties/edit/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, X, Upload, MapPin, Home, DollarSign, Bed, Bath, Car, Calendar, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { apiService } from '@/lib/api';

// TypeScript interfaces
interface Category {
  id: number;
  name: string;
  description?: string;
  type: 'open' | 'close';
  is_active: boolean;
}

interface PropertyFormData {
  name: string;
  description: string;
  property_category_id: number | '';
  location: string;
  address: string;
  latitude: number | '';
  longitude: number | '';
  price_per_square_feet: number | '';
  total_area: number | '';
  built_area: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
  parking_spaces: number | '';
  year_built: number | '';
  main_image: File | null;
  amenities: string[];
  status: 'available' | 'sold' | 'rented' | 'pending';
  is_featured: boolean;
  is_active: boolean;
}

interface Property {
  id: number;
  name: string;
  description: string;
  property_category_id: number;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  price_per_square_feet: number;
  total_area?: number;
  built_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  year_built?: number;
  main_image?: string;
  amenities: string | string[]; // Updated to handle both string and array
  status: 'available' | 'sold' | 'rented' | 'pending';
  is_featured: boolean;
  is_active: boolean;
}

const EditPropertyPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id'); // Get ID from query params

  const [property, setProperty] = useState<Property | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    property_category_id: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    price_per_square_feet: '',
    total_area: '',
    built_area: '',
    bedrooms: '',
    bathrooms: '',
    parking_spaces: '',
    year_built: '',
    main_image: null,
    amenities: [],
    status: 'available',
    is_featured: false,
    is_active: true,
  });

  // Common amenities list
  const commonAmenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Elevator', 'Garden',
    'Balcony', 'Terrace', 'Club House', 'Children Play Area', 'Power Backup',
    'Water Supply', 'Internet', 'AC', 'Furnished', 'Semi-Furnished'
  ];

  useEffect(() => {
    if (propertyId) {
      console.log('Property ID from URL:', propertyId);
      fetchProperty();
      fetchCategories();
    } else {
      console.error('No property ID found in URL');
      setError('No property ID provided');
      setPropertyLoading(false);
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    if (!propertyId) return;
    
    try {
      setPropertyLoading(true);
      setError(null);
      console.log('Fetching property with ID:', propertyId);
      
      const response = await apiService.getProperty(propertyId);
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        const propertyData = response.data;
        setProperty(propertyData);

        // Parse amenities from JSON string
let parsedAmenities: string[] = [];
if (propertyData.amenities) {
  try {
    parsedAmenities = typeof propertyData.amenities === 'string' 
      ? JSON.parse(propertyData.amenities) 
      : propertyData.amenities;
  } catch (error) {
    console.error('Error parsing amenities:', error);
    parsedAmenities = [];
  }
}

setFormData({
  name: propertyData.name || '',
  description: propertyData.description || '',
  property_category_id: propertyData.property_category_id || '',
  location: propertyData.location || '',
  address: propertyData.address || '',
  latitude: propertyData.latitude || '',
  longitude: propertyData.longitude || '',
  price_per_square_feet: propertyData.price_per_square_feet || '',
  total_area: propertyData.total_area || '',
  built_area: propertyData.built_area || '',
  bedrooms: propertyData.bedrooms || '',
  bathrooms: propertyData.bathrooms || '',
  parking_spaces: propertyData.parking_spaces || '',
  year_built: propertyData.year_built || '',
  main_image: null, // Will be handled separately for existing images
  amenities: parsedAmenities,
  status: propertyData.status || 'available',
  is_featured: propertyData.is_featured || false,
  is_active: propertyData.is_active !== undefined ? propertyData.is_active : true,
});
      } else {
        throw new Error(response.message || 'Failed to fetch property');
      }
    } catch (error: any) {
      console.error('Error fetching property:', error);
      setError(`Failed to load property data: ${error.message}`);
    } finally {
      setPropertyLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      console.log('Fetching categories...');
      
      const response = await apiService.getCategories();
      console.log('Categories response:', response);
      
      if (response.success && response.data) {
        // Filter only active categories
        const activeCategories = response.data.filter((cat: Category) => cat.is_active);
        setCategories(activeCategories);
        console.log('Active categories loaded:', activeCategories.length);
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.name.trim()) errors.name = 'Property name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.property_category_id) errors.property_category_id = 'Category is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.price_per_square_feet) errors.price_per_square_feet = 'Price per square feet is required';
    
    // Numeric validations
    if (formData.price_per_square_feet && formData.price_per_square_feet <= 0) {
      errors.price_per_square_feet = 'Price must be greater than 0';
    }
    
    if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }
    
    if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }
    
    if (formData.year_built && formData.year_built > new Date().getFullYear()) {
      errors.year_built = 'Year built cannot be in the future';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId) {
      setError('No property ID available');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setFormErrors({});
    setError(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('property_category_id', formData.property_category_id.toString());
      submitData.append('location', formData.location.trim());
      submitData.append('address', formData.address.trim());
      submitData.append('price_per_square_feet', formData.price_per_square_feet.toString());
      submitData.append('status', formData.status);
      submitData.append('is_featured', formData.is_featured ? '1' : '0');
      submitData.append('is_active', formData.is_active ? '1' : '0');
      
      // Optional fields
      if (formData.latitude) submitData.append('latitude', formData.latitude.toString());
      if (formData.longitude) submitData.append('longitude', formData.longitude.toString());
      if (formData.total_area) submitData.append('total_area', formData.total_area.toString());
      if (formData.built_area) submitData.append('built_area', formData.built_area.toString());
      if (formData.bedrooms) submitData.append('bedrooms', formData.bedrooms.toString());
      if (formData.bathrooms) submitData.append('bathrooms', formData.bathrooms.toString());
      if (formData.parking_spaces) submitData.append('parking_spaces', formData.parking_spaces.toString());
      if (formData.year_built) submitData.append('year_built', formData.year_built.toString());
      
      // Amenities as JSON
      if (formData.amenities.length > 0) {
        submitData.append('amenities', JSON.stringify(formData.amenities));
      }
      
      // Main image (only if new image is selected)
      if (formData.main_image) {
        submitData.append('main_image', formData.main_image);
      }
      
      // Add _method for PUT request (Laravel convention)
      submitData.append('_method', 'PUT');
      
      console.log('Submitting property update for ID:', propertyId);
      const response = await apiService.updateProperty(propertyId, submitData);
      
      if (response.success) {
        console.log('Property updated successfully');
        router.push('/admin/properties/list');
      } else {
        throw new Error(response.message || 'Failed to update property');
      }
    } catch (error: any) {
      console.error('Error updating property:', error);
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        setError(error.message || 'An error occurred while updating the property');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, main_image: file }));
    }
  };

  // Show loading state
  if (propertyLoading || categoriesLoading) {
    return (
      <div className="space-y-6 bg-[#FCFCFC] dark:bg-black min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading property data...</span>
        </div>
      </div>
    );
  }

  // Show error if property not found or no ID
  if ((!property && !propertyLoading) || !propertyId) {
    return (
      <div className="space-y-6 bg-[#FCFCFC] dark:bg-black min-h-screen p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-800 dark:text-red-300 font-medium">
              {!propertyId ? 'No Property ID' : 'Property Not Found'}
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm">
              {!propertyId 
                ? 'No property ID was provided in the URL.' 
                : 'The requested property could not be found.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/properties')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#FCFCFC] dark:bg-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white-900">Edit Property</h1>
          <p className="text-white-600">Update property information</p>
        </div>
        <button
          onClick={() => router.push('/admin/properties')}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {formErrors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {formErrors.general}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-black rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white-700 mb-1">
                Property Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter property name"
                required
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter property description"
                required
              />
              {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.property_category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, property_category_id: e.target.value ? parseInt(e.target.value) : '' }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.property_category_id ? 'border-red-300' : 'border-gray-300'
                }`}
                required
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.type})
                  </option>
                ))}
              </select>
              {formErrors.property_category_id && <p className="mt-1 text-sm text-red-600">{formErrors.property_category_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full bg-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-black rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Koramangala, Bangalore"
                required
              />
              {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value ? parseFloat(e.target.value) : '' }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.latitude ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 12.9716"
              />
              {formErrors.latitude && <p className="mt-1 text-sm text-red-600">{formErrors.latitude}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value ? parseFloat(e.target.value) : '' }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.longitude ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 77.5946"
              />
              {formErrors.longitude && <p className="mt-1 text-sm text-red-600">{formErrors.longitude}</p>}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-black rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Property Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Sq Ft <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_per_square_feet}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_square_feet: e.target.value ? parseFloat(e.target.value) : '' }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.price_per_square_feet ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                required
              />
              {formErrors.price_per_square_feet && <p className="mt-1 text-sm text-red-600">{formErrors.price_per_square_feet}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Area (sq ft)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.total_area}
                onChange={(e) => setFormData(prev => ({ ...prev, total_area: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Built Area (sq ft)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.built_area}
                onChange={(e) => setFormData(prev => ({ ...prev, built_area: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Bed className="w-4 h-4" />
                Bedrooms
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value ? parseInt(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Bath className="w-4 h-4" />
                Bathrooms
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value ? parseInt(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Parking Spaces
              </label>
              <input
                type="number"
                value={formData.parking_spaces}
                onChange={(e) => setFormData(prev => ({ ...prev, parking_spaces: e.target.value ? parseInt(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Year Built
              </label>
              <input
                type="number"
                value={formData.year_built}
                onChange={(e) => setFormData(prev => ({ ...prev, year_built: e.target.value ? parseInt(e.target.value) : '' }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.year_built ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear()}
              />
              {formErrors.year_built && <p className="mt-1 text-sm text-red-600">{formErrors.year_built}</p>}
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="bg-black rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Main Image
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Image (optional)
            </label>
            {property?.main_image && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${property.main_image}`} 
                  alt="Current property image" 
                  className="w-32 h-24 object-cover rounded border"
                  onError={(e) => {
                    console.error('Image failed to load:', property.main_image);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.main_image && (
              <p className="mt-2 text-sm text-green-600">
                New image selected: {formData.main_image.name}
              </p>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-black rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white-900 mb-4">
            Amenities
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-black rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white-900 mb-4">
            Settings
          </h2>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Property</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/properties')}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || categoriesLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyPage;