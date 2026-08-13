const API_BASE = 'http://localhost:5000/api';

export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
};
