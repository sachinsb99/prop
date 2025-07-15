"use client";
import React, { useState } from 'react';
import { Home, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '@/lib/api'; // Import your API service

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string[] | undefined;
}

type SubmitStatus = 'success' | 'error' | 'validation_error' | null;

const HomeEnquiry: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    // Basic client-side validation
    const newErrors: ValidationErrors = {};
    if (!formData.name.trim()) newErrors.name = ['Name is required'];
    if (!formData.email.trim()) newErrors.email = ['Email is required'];
    if (!formData.message.trim()) newErrors.message = ['Message is required'];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // FIXED: Use the API service instead of direct fetch
      const response = await apiService.submitEnquiry(formData);
      
      if (response.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
      } else {
        setSubmitStatus('error');
        console.error('Server error:', response);
      }
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      
      // Handle validation errors from Laravel
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        setSubmitStatus('validation_error');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string): string | null => {
    return errors[fieldName] ? errors[fieldName]![0] : null;
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              One Message Away
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
            Your perfect home is just one message away. Tell us what you're looking for and we'll do the rest.
          </p>
        </div>

        {/* Enquiry Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Send Your Home Enquiry
            </h2>
            <p className="text-gray-600">
              Quick and simple - we'll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${
                  getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${
                  getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${
                  getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Tell Us What You're Looking For *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe your dream home... (e.g., 3 bedrooms, near schools, budget $500k, downtown area, etc.)"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none ${
                  getFieldError('message') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getFieldError('message') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('message')}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending Your Enquiry...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send My Enquiry
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="text-emerald-800 font-medium">
                Enquiry sent successfully! We'll contact you within 24 hours with personalized recommendations.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">
                Something went wrong. Please try again or contact us directly.
              </p>
            </div>
          )}

          {submitStatus === 'validation_error' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">
                Please check the form fields and try again.
              </p>
            </div>
          )}
        </div>

        {/* Simple Features */}
        <div className="mt-10 text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>24H Response</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>No Commitment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Free Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeEnquiry;