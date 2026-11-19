const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('wedplan_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    register: (payload: any) =>
      request<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: any) =>
      request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    googleSync: (payload: any) =>
      request<any>('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),
    githubSync: (payload: any) =>
      request<any>('/auth/github', { method: 'POST', body: JSON.stringify(payload) }),
    getMe: () =>
      request<any>('/auth/me', { method: 'GET' }),
    updateProfile: (payload: any) =>
      request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
    changePassword: (payload: { oldPassword: string; newPassword: string; confirmPassword: string }) =>
      request<any>('/auth/change-password', { method: 'PUT', body: JSON.stringify(payload) }),
  },

  // Services
  services: {
    getApproved: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
      return request<any>(`/services?${query.toString()}`);
    },
    getFeatured: () =>
      request<any>('/services/featured'),
    getById: (id: string) =>
      request<any>(`/services/${id}`),
    getVendorServices: () =>
      request<any>('/services/vendor/my-services'),
    create: (payload: any) =>
      request<any>('/services', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: any) =>
      request<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id: string) =>
      request<any>(`/services/${id}`, { method: 'DELETE' }),
    getAdminAll: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
      return request<any>(`/services/admin/all?${query.toString()}`);
    },
    updateStatusAdmin: (id: string, payload: { status?: string; isActive?: boolean }) =>
      request<any>(`/services/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  },

  // Bookings
  bookings: {
    create: (payload: { serviceId: string; eventDate: string; eventLocation: string; message?: string }) =>
      request<any>('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
    getCustomerBookings: () =>
      request<any>('/bookings/customer/my-bookings'),
    cancelBooking: (id: string) =>
      request<any>(`/bookings/${id}/cancel`, { method: 'PATCH' }),
    getVendorRequests: () =>
      request<any>('/bookings/vendor/requests'),
    updateStatus: (id: string, status: 'Accepted' | 'Rejected') =>
      request<any>(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // Transactions & Stripe
  transactions: {
    createCheckoutSession: (payload?: { plan?: 'premium' | 'vip'; interval?: 'monthly' | 'yearly' }) =>
      request<any>('/transactions/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify(payload || {}),
      }),
    verifySession: (sessionId: string, extra?: { uid?: string; plan?: string }) =>
      request<any>('/transactions/verify-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId, ...(extra || {}) }),
      }),
    getVendorTransactions: () =>
      request<any>('/transactions/my-transactions'),
    getAdminAll: () =>
      request<any>('/transactions/admin/all'),
  },

  // Admin Users & Analytics
  users: {
    getAdminAll: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
      return request<any>(`/users/admin/all?${query.toString()}`);
    },
    toggleBlock: (id: string) =>
      request<any>(`/users/admin/${id}/toggle-block`, { method: 'PATCH' }),
    getAdminStats: () =>
      request<any>('/users/admin/stats'),
  },
};
