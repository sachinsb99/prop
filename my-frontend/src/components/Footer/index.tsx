"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Footer = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const propertyTips = [
    "💡 First-time buyers get up to 15% off closing costs",
    "🏠 Virtual tours available 24/7 for all properties",
    "🌟 Average property value increased by 12% this year",
    "🔑 Same-day property viewings available",
    "💰 Flexible payment plans starting from just 10% down"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % propertyTips.length);
    }, 3000);
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    const footer = document.querySelector('#footer');
    if (footer) observer.observe(footer);
    
    return () => {
      clearInterval(interval);
      if (footer) observer.unobserve(footer);
    };
  }, []);

  const socialLinks = [
    { 
      name: "Facebook", 
      href: "/", 
      icon: "M12.1 10.4939V7.42705C12.1 6.23984 13.085 5.27741 14.3 5.27741H16.5V2.05296L13.5135 1.84452C10.9664 1.66676 8.8 3.63781 8.8 6.13287V10.4939H5.5V13.7183H8.8V20.1667H12.1V13.7183H15.4L16.5 10.4939H12.1Z",
      color: "hover:text-blue-500"
    },
    { 
      name: "Twitter", 
      href: "/", 
      icon: "M13.9831 19.25L9.82094 13.3176L4.61058 19.25H2.40625L8.843 11.9233L2.40625 2.75H8.06572L11.9884 8.34127L16.9034 2.75H19.1077L12.9697 9.73737L19.6425 19.25H13.9831ZM16.4378 17.5775H14.9538L5.56249 4.42252H7.04674L10.808 9.6899L11.4584 10.6039L16.4378 17.5775Z",
      color: "hover:text-sky-400"
    },
    { 
      name: "Instagram", 
      href: "/", 
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
      color: "hover:text-pink-500"
    }
  ];

  return (
    <>
      <footer 
        id="footer"
        className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-2000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-white/20 animate-bounce delay-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <div className="absolute top-20 right-20 text-white/20 animate-bounce delay-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute bottom-20 left-20 text-white/20 animate-bounce delay-1000">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v9a2 2 0 002 2h8a2 2 0 002-2v-9h-2m-1-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3m-3 1h12l-1 12H8l-1-12z"/>
            </svg>
          </div>
        </div>

        <div className="container relative z-10">
          {/* Property Tips Banner */}
          <div className="mb-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 mx-4">
            <div className="flex items-center justify-center text-white font-medium">
              <span className="animate-pulse mr-2">🏠</span>
              <span className="transition-all duration-500">
                {propertyTips[currentTip]}
              </span>
            </div>
          </div>

          <div className="-mx-4 flex flex-wrap">
            {/* Brand Section */}
            <div className="w-full px-4 md:w-1/2 lg:w-5/12">
              <div className="mb-12 max-w-[400px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                    <Image
                      src="/images/logo/prop_aura_acres-2.png"
                      alt="logo"
                      className="w-full"
                      width={160}
                      height={40}
                    />
                  </div>
                </Link>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-3">🏡</span>
                    Find Your Dream Home
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Where memories are made and futures begin. We don't just sell properties, 
                    we help you find the perfect place to call home. From cozy apartments to 
                    luxury estates, every property tells a story.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                      ✓ Verified Properties
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                      ✓ 24/7 Support
                    </span>
                  </div>
                </div>

                {/* Social Links with Hover Effects */}
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 duration-300 hover:bg-white/20 hover:scale-110 ${social.color} transition-all`}
                    >
                      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                        <path d={social.icon} fill="currentColor" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-8 text-xl font-bold text-white flex items-center">
                  <span className="mr-2">🔗</span>
                  Quick Links
                </h2>
                <div className="space-y-3">
                  {[
                    { name: "Property Search", href: "/search", icon: "🔍" },
                    { name: "Virtual Tours", href: "/tours", icon: "🎥" },
                    { name: "Market Insights", href: "/insights", icon: "📊" },
                    { name: "Investment Guide", href: "/guide", icon: "💼" }
                  ].map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="group flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                    >
                      <span className="mr-3 text-lg">{link.icon}</span>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {link.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Services */}
            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-8 text-xl font-bold text-white flex items-center">
                  <span className="mr-2">🏘️</span>
                  Services
                </h2>
                <div className="space-y-3">
                  {[
                    { name: "Buy Properties", href: "/buy", icon: "🏠" },
                    { name: "Rent Properties", href: "/rent", icon: "🔑" },
                    { name: "Sell Your Home", href: "/sell", icon: "💰" },
                    { name: "Property Management", href: "/manage", icon: "🏢" }
                  ].map((service, index) => (
                    <Link
                      key={index}
                      href={service.href}
                      className="group flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                    >
                      <span className="mr-3 text-lg">{service.icon}</span>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {service.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="w-full px-4 md:w-1/2 lg:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-8 text-xl font-bold text-white flex items-center">
                  <span className="mr-2">📞</span>
                  Get In Touch
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">🌟 Premium Support</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Our property experts are here to help you 24/7
                    </p>
                    <Link
                      href="/contact"
                      className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                    >
                      Contact Expert
                    </Link>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">📧 Newsletter</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Get the latest property deals & market updates
                    </p>
                    <div className="flex">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600 transition-colors">
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-300">
                  © 2024 Your Property Dreams. Made with ❤️ for homeowners everywhere.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Powered by innovation • Driven by passion • Trusted by thousands
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 opacity-10">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid)"/>
          </svg>
        </div>
      </footer>
    </>
  );
};

export default Footer;