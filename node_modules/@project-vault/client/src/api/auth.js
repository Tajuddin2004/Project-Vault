const API_BASE = 'http://localhost:5000/api';
let csrfTokenCache = null;

export async function fetchCsrfToken() {
  try {
    const res = await fetch(`${API_BASE}/csrf-token`);
    const data = await res.json();
    if (data.csrfToken) {
      csrfTokenCache = data.csrfToken;
    }
    return csrfTokenCache;
  } catch (e) {
    return null;
  }
}

export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (method !== 'GET' && method !== 'HEAD') {
    if (!csrfTokenCache) {
      await fetchCsrfToken();
    }
    if (csrfTokenCache) {
      headers['X-CSRF-Token'] = csrfTokenCache;
    }
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    let data = {};
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }

    if (!res.ok) {
      throw new Error(data.message || `Server error (${res.status})`);
    }
    return data;
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Unable to connect to backend server. Operating in offline demo mode.');
    }
    throw err;
  }
}

export const authApi = {
  checkEmail: (email) => apiRequest(`/auth/check-email?email=${encodeURIComponent(email)}`, 'GET'),
  register: (payload) => apiRequest('/auth/register', 'POST', payload),
  verifyOtp: (payload) => apiRequest('/auth/verify-otp', 'POST', payload),
  resendOtp: (email) => apiRequest('/auth/resend-otp', 'POST', { email }),
  login: (payload) => apiRequest('/auth/login', 'POST', payload),
  googleOAuth: (payload) => apiRequest('/auth/google-oauth', 'POST', payload),
  githubOAuth: (payload) => apiRequest('/auth/github-oauth', 'POST', payload),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', 'POST', { email }),
  verifyResetToken: (token) => apiRequest(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`, 'GET'),
  resetPassword: (payload) => apiRequest('/auth/reset-password', 'POST', payload),
  getMe: (token) => apiRequest('/auth/me', 'GET', null, token),
  updateProfile: (payload, token) => apiRequest('/auth/profile', 'PUT', payload, token),
  updateProfileFormData: async (formData, token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },
};
