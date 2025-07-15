"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const SectionTitle = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "100px",
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <>
      <div
        className={`w-full ${center ? "mx-auto text-center" : ""}`}
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <h2 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-[45px] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-base leading-relaxed text-body-color md:text-lg opacity-90">
          {paragraph}
        </p>
      </div>
    </>
  );
};

const PropertyIcon = ({ type }) => {
  const icons = {
    home: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
    building: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
      </svg>
    ),
    key: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M12.65 10A6 6 0 0 0 7 4a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14a4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4 4 4 4 0 0 1-4 4z"/>
        <circle cx="7" cy="10" r="1"/>
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11A1,1 0 0,1 14,12H13V16H11V12H10A1,1 0 0,1 9,11V10.5C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10.5V10.8H13.8V10.5C13.8,8.7 12.8,8.2 12,8.2Z"/>
      </svg>
    ),
    chart: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
      </svg>
    ),
    heart: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
      </svg>
    )
  };
  return icons[type] || icons.home;
};

const AboutSectionOne = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { 
      icon: 'home', 
      title: 'Premium Properties', 
      description: 'Curated selection of luxury homes and commercial spaces' 
    },
    { 
      icon: 'building', 
      title: 'Expert Development', 
      description: 'Professional construction and architectural excellence' 
    },
    { 
      icon: 'key', 
      title: 'Seamless Experience', 
      description: 'End-to-end property solutions from search to settlement' 
    },
    { 
      icon: 'shield', 
      title: 'Trusted Service', 
      description: 'Transparent dealings with complete legal compliance' 
    },
    { 
      icon: 'chart', 
      title: 'Investment Growth', 
      description: 'Strategic locations with high appreciation potential' 
    },
    { 
      icon: 'heart', 
      title: 'Client Satisfaction', 
      description: 'Dedicated to making your property dreams a reality' 
    }
  ];

  const PropertyFeature = ({ icon, title, description, index }) => (
    <div 
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
        activeFeature === index ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg' : 'bg-white dark:bg-gray-800/50'
      }`}
      style={{
        animation: isVisible ? `slideInUp 0.8s ease-out ${index * 0.1}s both` : 'none'
      }}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${
          activeFeature === index 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          <PropertyIcon type={icon} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
      
      <section id="about" className="relative pt-16 md:pt-20 lg:pt-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        </div>
        
        <div className="container relative z-10">
          <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4 lg:w-1/2">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <SectionTitle
                    title="Building Dreams, Creating Homes"
                    paragraph="We are passionate about transforming spaces into extraordinary places. With decades of expertise in real estate development, property management, and architectural excellence, we bring your vision to life through innovative design and uncompromising quality."
                    mb="44px"
                  />
                </div>
                
                <div className="mb-12 max-w-[570px] lg:mb-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <PropertyFeature
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="w-full px-4 lg:w-1/2">
                <div className="relative mx-auto aspect-square max-w-[500px] lg:mr-0">
                  {/* Modern Property Illustration */}
                  <div className={`floating-animation relative w-full h-full transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl transform rotate-6 opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl transform -rotate-6 opacity-20" />
                    
                    <div className="relative z-10 w-full h-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center">
                      {/* Building Icon */}
                      <div className="mb-6 p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                        <svg width="80" height="80" viewBox="0 0 24 24" className="fill-white">
                          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                        </svg>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-center space-y-4">
                        <div className="flex justify-center space-x-8">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Properties Sold</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">25+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center space-x-8">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">98%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">50+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSectionOne;