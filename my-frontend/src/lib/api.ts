// lib/api.ts - Updated API service with correct FormData handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  // Add other fields as needed
}

export interface EnquiryResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Add other fields as needed
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // FIXED: Modified to handle FormData properly
  private getHeaders(isFormData: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // // FIXED: Updated request method to handle FormData
  // private async request<T>(
  //   endpoint: string, 
  //   options: RequestInit = {}
  // ): Promise<T> {
  //   const url = `${this.baseURL}${endpoint}`;
    
  //   // Check if body is FormData
  //   const isFormData = options.body instanceof FormData;
    
  //   const response = await fetch(url, {
  //     ...options,
  //     headers: {
  //       ...this.getHeaders(isFormData),
  //       ...options.headers,
  //     },
  //   });

  //   const data = await response.json().catch(() => ({}));

  //   if (!response.ok) {
  //     // Enhanced error handling for validation errors
  //     if (response.status === 422 && data.errors) {
  //       const error = new Error(data.message || 'Validation failed');
  //       (error as any).response = { status: response.status, data };
  //       throw error;
  //     }
      
  //     const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
  //     throw new Error(errorMessage);
  //   }

  //   return data;
  // FIXED: Updated request method to handle FormData
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Check if body is FormData
    const isFormData = options.body instanceof FormData;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Enhanced error handling for validation errors
      if (response.status === 422 && data.errors) {
        const error = new Error(data.message || 'Validation failed');
        (error as any).response = { status: response.status, data };
        throw error;
      }
      
      const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  }

  // ENQUIRY API METHODS
  // Submit new enquiry
  async submitEnquiry(enquiryData: EnquiryData): Promise<ApiResponse<EnquiryResponse>> {
    return this.request<ApiResponse<EnquiryResponse>>('/enquiry', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    });
  }

  // Auth methods (add your existing auth methods here)
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Authentication methods
  setAuthToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeAuthToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth API calls
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request<ApiResponse>('/auth/logout', {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    } finally {
      this.removeAuthToken();
    }
  }

  // Profile methods
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/profile');
  }

  async updateProfile(data: ProfileUpdateData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Google OAuth methods
  getGoogleAuthUrl(): string {
    return `${this.baseURL}/auth/google/redirect`;
  }

  async handleGoogleCallback(code: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/google/callback', {
      method: 'GET',
      body: JSON.stringify({ code }),
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  // Properties methods
  async getProperties(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/properties');
  }

  async getProperty(id: string | number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/properties/${id}`);
  }

  async createProperty(data: FormData): Promise<ApiResponse> {
    // Debug: Log FormData contents
    console.log('FormData being sent:');
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    
    return this.request<ApiResponse>('/properties', {
      method: 'POST',
      body: data, // FormData will be handled properly now
    });
  }

  async updateProperty(id: string | number, data: FormData | any): Promise<ApiResponse> {
  const method = data instanceof FormData ? 'POST' : 'PUT';
  const body = data instanceof FormData ? data : JSON.stringify(data);
      
    return this.request<ApiResponse>(`/properties/${id}`, {
      method,
      body,
    });
  }

  async deleteProperty(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories methods
  async getCategories(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/categories');
  }

  async createCategory(data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: number, data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }



  // Get all enquiries with pagination and filtering
  async getEnquiries(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{
    data: EnquiryResponse[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/enquiry${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  // Get single enquiry by ID
  async getEnquiry(id: number): Promise<ApiResponse<EnquiryResponse>> {
    return this.request<ApiResponse<EnquiryResponse>>(`/enquiry/${id}`, {
      method: 'GET',
    });
  }

  // Update enquiry status
  async updateEnquiryStatus(id: number, status: string): Promise<ApiResponse<EnquiryResponse>> {
    return this.request<ApiResponse<EnquiryResponse>>(`/enquiry/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Update entire enquiry
  async updateEnquiry(id: number, enquiryData: Partial<EnquiryData>): Promise<ApiResponse<EnquiryResponse>> {
    return this.request<ApiResponse<EnquiryResponse>>(`/enquiry/${id}`, {
      method: 'PUT',
      body: JSON.stringify(enquiryData),
    });
  }

  // Delete enquiry
  async deleteEnquiry(id: number): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/enquiry/${id}`, {
      method: 'DELETE',
    });
  }

  // Get enquiry statistics (optional - for admin dashboard)
  async getEnquiryStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    resolved: number;
    recent: number;
  }>> {
    return this.request<ApiResponse<{
      total: number;
      pending: number;
      resolved: number;
      recent: number;
    }>>('/enquiry/stats', {
      method: 'GET',
    });
  }


}

export const apiService = new ApiService();