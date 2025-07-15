'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { apiService } from '@/lib/api';

// Types based on your database structure
interface Property {
  id: number;
  name: string;
  slug: string;
  description: string;
  property_category_id: number;
  location: string;
  address?: string;
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
  amenities?: string; // JSON string
  status: 'available' | 'sold' | 'rented' | 'pending';
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Property[];
  message?: string;
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

const PropertyCarousel: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch properties...');
        
        const response = await apiService.getProperties();
        console.log('Fetched properties:', response);
        
        // Handle different response structures
        if (response.success && response.data) {
          setProperties(response.data);
        } else if (Array.isArray(response.data)) {
          setProperties(response.data);
        } else {
          // Handle Laravel Eloquent Collection response structure
          if (Array.isArray(response) && response.length > 0) {
            const collection = response[0]['Illuminate\\Database\\Eloquent\\Collection'];
            if (Array.isArray(collection)) {
              setProperties(collection);
            } else {
              setProperties([]);
            }
          } else {
            setProperties([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (pricePerSqft: number, totalArea?: number) => {
    if (totalArea) {
      const totalPrice = pricePerSqft * totalArea;
      return `₹${totalPrice.toLocaleString('en-IN')}`;
    }
    return `₹${pricePerSqft.toLocaleString('en-IN')}/sqft`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { bg: 'bg-emerald-500', text: 'Available', icon: '✅' },
      sold: { bg: 'bg-red-500', text: 'Sold', icon: '🔴' },
      rented: { bg: 'bg-blue-500', text: 'Rented', icon: '🔵' },
      pending: { bg: 'bg-amber-500', text: 'Pending', icon: '⏳' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${config.bg} shadow-sm backdrop-blur-sm`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  // Function to get the correct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/images/placeholder-property.jpg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Construct the full URL for your Laravel storage
    // Adjust this base URL to match your Laravel storage configuration
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="px-6 sm:px-8 lg:px-16 py-12">
        <div className="flex items-center justify-center h-72">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 sm:px-8 lg:px-16 py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="text-red-500 mb-6">
              <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xl font-semibold text-red-700">Oops! Something went wrong</p>
              <p className="text-sm text-red-600 mt-2 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="px-6 sm:px-8 lg:px-16 py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</p>
            <p className="text-sm text-gray-500">Check back later for new listings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 lg:px-16 py-12">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          Premium Properties
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover exceptional properties curated just for you. Find your perfect space in prime locations.
        </p>
      </div>

      {/* Enhanced Carousel Container */}
      <div className="relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          loop={properties.length > 1}
          modules={[Navigation, Autoplay, Pagination]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current
          }}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          pagination={{ 
            clickable: true, 
            el: '.custom-pagination',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active'
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 28,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 36,
            },
            1536: {
              slidesPerView: 4,
              spaceBetween: 40,
            }
          }}
          className="pb-8"
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 max-w-sm mx-auto">
                  {/* Enhanced Property Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={getImageUrl(property.main_image || '')} 
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-property.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Enhanced Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {property.is_featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                          ⭐ Featured
                        </span>
                      )}
                      {getStatusBadge(property.status)}
                    </div>
                    
                    {property.total_area && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                        📐 {property.total_area.toLocaleString()} sqft
                      </div>
                    )}
                    
                    {/* Heart Icon */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors duration-300 group/heart">
                      <svg className="w-5 h-5 text-gray-600 group-hover/heart:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Enhanced Property Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                        {property.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm line-clamp-1 font-medium">{property.location}</span>
                      </div>

                      {property.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {property.category.name}
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPrice(property.price_per_square_feet, property.total_area)}
                      </div>
                      {property.total_area && (
                        <div className="text-sm text-gray-500">
                          ₹{property.price_per_square_feet.toLocaleString('en-IN')}/sqft
                        </div>
                      )}
                    </div>

                    {/* Enhanced Property Features */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {property.bedrooms && (
                          <div className="flex items-center text-gray-600">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-1">
                              <span className="text-xs">🛏️</span>
                            </div>
                            <span className="text-sm font-medium">{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center text-gray-600">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-1">
                              <span className="text-xs">🛁</span>
                            </div>
                            <span className="text-sm font-medium">{property.bathrooms}</span>
                          </div>
                        )}
                        {property.parking_spaces && (
                          <div className="flex items-center text-gray-600">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-1">
                              <span className="text-xs">🚗</span>
                            </div>
                            <span className="text-sm font-medium">{property.parking_spaces}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Additional Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(property.created_at)}</span>
                      </div>
                      {property.year_built && (
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Built {property.year_built}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Enhanced Custom Navigation and Pagination */}
      <div className="flex items-center justify-center mt-12 space-x-8">
        <button
          ref={prevRef}
          className="group w-14 h-14 bg-white border-2 border-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          disabled={properties.length <= 1}
        >
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="custom-pagination flex space-x-3"></div>

        <button
          ref={nextRef}
          className="group w-14 h-14 bg-white border-2 border-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          disabled={properties.length <= 1}
        >
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          background: #e5e7eb;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .swiper-pagination-bullet:hover {
          background: #9ca3af;
          transform: scale(1.1);
        }
        
        .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          transform: scale(1.3);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .swiper-slide {
          height: auto;
        }
        
        .swiper-slide .group {
          height: 100%;
        }
        
        .swiper-slide .group > div {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .swiper-slide .group > div > div:last-child {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};

export default PropertyCarousel;