// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API Helper Functions
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with any additional headers from options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('API Request:', {
    url,
    method: options.method || 'GET',
    headers,
    body: options.body,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include',
    });

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      console.error('API Error:', error);
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Success:', data);
    return data;
  } catch (error) {
    console.error('❌ API Request Failed:', {
      url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Provide more helpful error messages
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3000');
    }
    
    throw error;
  }
};

// Default export for axios-like usage
const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, { 
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  patch: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, { 
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  }),
  put: <T>(endpoint: string, data?: any) => apiRequest<T>(endpoint, { 
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export default api;
