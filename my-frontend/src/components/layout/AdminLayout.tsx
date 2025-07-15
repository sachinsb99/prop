// components/layout/AdminLayout.tsx (Updated with proper API integration)
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {LayoutDashboard,  User,  Settings,  LogOut, Menu, Home, ChevronDown, ChevronRight, Building, List, Plus, Tag } from 'lucide-react';
import { apiService, User as UserType } from '@/lib/api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setError(null);
      
      // Check if user is authenticated
      if (!apiService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      console.log('Fetching user profile...');
      const response = await apiService.getProfile();
      
      console.log('Profile response:', response);
      
      if (response.success && response.data) {
        setUser(response.data);
        console.log('User data loaded:', response.data);
      } else {
        console.error('Profile fetch failed:', response.message);
        setError(response.message || 'Failed to load profile');
        // If profile fetch fails, user might not be properly authenticated
        apiService.removeAuthToken();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        // Check for authentication errors
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('Unauthenticated')) {
          console.log('Authentication error detected, redirecting to login');
          apiService.removeAuthToken();
          router.push('/login');
          return;
        }
        
        // Check for network errors
        if (errorMessage.includes('fetch') || errorMessage.includes('NetworkError')) {
          setError('Network error. Please check your connection.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    
    setLoggingOut(true);
    setError(null);
    
    try {
      console.log('Logging out...');
      
      // Call logout API
      const response = await apiService.logout();
      console.log('Logout response:', response);
      
      if (response.success) {
        console.log('Logout successful:', response.message);
      } else {
        console.warn('Logout API returned success=false:', response.message);
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      // Don't show error to user for logout - still proceed with redirect
    } finally {
      setLoggingOut(false);
      
      // Always clear local state and redirect to home, even if API call fails
      setUser(null);
      console.log('Redirecting to home page...');
      router.push('/home');
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'Loading...';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.last_name) {
      return user.last_name;
    } else {
      return user.email.split('@')[0]; // Use email username as fallback
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    } else if (user.first_name) {
      return user.first_name.substring(0, 2).toUpperCase();
    } else if (user.last_name) {
      return user.last_name.substring(0, 2).toUpperCase();
    } else {
      return user.email.substring(0, 2).toUpperCase();
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      icon: User,
      label: 'Profile',
      href: '/admin/profile',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/admin/settings',
    },
  ];

  const propertyMenuItems = [
    {
      icon: List,
      label: 'Add Properties',
      href: '/admin/properties/add',
    },
    {
      icon: Plus,
      label: 'All Property',
      href: '/admin/properties/list',
    },
    {
      icon: Tag,
      label: 'Categories',
      href: '/admin/categories',
    },
  ];

  // Show loading state while checking authentication
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error and no user data
  if (error && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Profile</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-3">
              <button 
                onClick={fetchUserProfile}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Show error banner if there's an error but user is still loaded */}
      {error && user && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-sm z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-800">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-gray-900 font-bold text-sm">AL</span>
            </div>
            <span className="text-xl font-semibold text-white">Acet Labs</span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}

            {/* Properties Section */}
            <div className="space-y-1">
              <button
                onClick={() => setPropertiesOpen(!propertiesOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-3" />
                  Properties
                </div>
                {propertiesOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {propertiesOpen && (
                <div className="ml-4 space-y-1">
                  {propertyMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="px-4 py-4 border-t border-gray-800">
            {/* User Profile */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-medium text-sm">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-300 text-sm font-medium truncate">
                  {getUserDisplayName()}
                </div>
                {user && (
                  <div className="text-gray-400 text-xs truncate">
                    {user.email}
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm px-6 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Mobile User Info */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-medium text-xs">
                  {getUserInitials()}
                </span>
              </div>
              <span className="text-gray-700 text-sm">
                {getUserDisplayName()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 ${error && user ? 'pt-16' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;