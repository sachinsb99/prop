"use client";

import { useState, useEffect } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import blogData from "./blogData";

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('blog-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const blogCategories = [
    { id: 'all', name: 'All Stories', icon: '📚' },
    { id: 'tips', name: 'Home Tips', icon: '💡' },
    { id: 'market', name: 'Market Insights', icon: '📈' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🏡' },
    { id: 'investment', name: 'Investment', icon: '💰' }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .blog-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .blog-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .floating-icon {
          animation: float 4s ease-in-out infinite;
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        .filter-tab {
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .filter-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .featured-badge {
          background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
          animation: pulse 2s infinite;
        }
        
        .trending-badge {
          background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
          animation: pulse 2s infinite;
        }
      `}</style>

      <section
        id="blog-section"
        className="relative py-16 md:py-20 lg:py-28 overflow-hidden"
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 floating-icon opacity-20">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📖</span>
          </div>
        </div>
        <div className="absolute bottom-10 left-10 floating-icon opacity-20" style={{ animationDelay: '1s' }}>
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏠</span>
          </div>
        </div>

        <div className="container relative z-10">
          {/* Enhanced Section Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase">
                Latest Insights
              </span>
            </div>
            <SectionTitle
              title="Discover Your Dream Home with Us"
              paragraph="We understand that finding the perfect home is more than just a transaction; it's about finding a place where you can truly belong. Let us help you navigate your journey with care and expertise."
              center
            />
          </div>

          {/* Filter Tabs */}
          <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {blogCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`filter-tab px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category.id
                    ? 'active'
                    : 'bg-white/50 text-gray-700 hover:bg-white/80 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800/80'
                } border border-gray-200 dark:border-gray-700`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Blog Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: '250+', label: 'Expert Articles', icon: '📝', color: 'from-blue-500 to-cyan-500' },
              { number: '50K+', label: 'Monthly Readers', icon: '👥', color: 'from-green-500 to-emerald-500' },
              { number: '95%', label: 'Helpful Rating', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
              { number: '24/7', label: 'Fresh Content', icon: '🔄', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 blog-card">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Blog Grid */}
          <div className="blog-grid">
            {blogData.map((blog, index) => (
              <div
                key={blog.id}
                className={`blog-card rounded-3xl overflow-hidden transition-all duration-500 relative group ${
                  hoveredCard === blog.id ? 'z-20' : 'z-10'
                }`}
                style={{
                  animation: isVisible ? `slideInUp 0.6s ease-out ${index * 0.15}s both` : 'none'
                }}
                onMouseEnter={() => setHoveredCard(blog.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Featured/Trending Badges */}
                {index === 0 && (
                  <div className="absolute top-4 left-4 z-30 featured-badge text-black text-xs font-semibold px-3 py-1 rounded-full">
                    ⭐ Featured
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute top-4 left-4 z-30 trending-badge text-white text-xs font-semibold px-3 py-1 rounded-full">
                    🔥 Trending
                  </div>
                )}

                {/* Enhanced SingleBlog Component Wrapper */}
                <div className="relative">
                  <SingleBlog blog={blog} />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Shimmer Effect */}
                  {hoveredCard === blog.id && (
                    <div className="absolute inset-0 shimmer-effect pointer-events-none" />
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="flex space-x-2">
                    <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
                        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                      </svg>
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
                        <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Call to Action */}
          
        </div>

        {/* Enhanced Background SVG */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 overflow-hidden">
          <svg viewBox="0 0 400 800" className="w-full h-full">
            <defs>
              <linearGradient id="blogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="150" r="80" fill="url(#blogGradient)" opacity="0.3" />
            <circle cx="350" cy="300" r="60" fill="url(#blogGradient)" opacity="0.2" />
            <circle cx="100" cy="500" r="100" fill="url(#blogGradient)" opacity="0.25" />
            <circle cx="300" cy="650" r="70" fill="url(#blogGradient)" opacity="0.3" />
          </svg>
        </div>
      </section>
    </>
  );
};

export default Blog;