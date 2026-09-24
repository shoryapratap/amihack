// API Client for Surplus-to-Shelter Platform
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // If body is FormData, delete Content-Type to let browser set boundary
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.detail || data?.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Donations
  getDonations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/donations${query ? `?${query}` : ''}`);
  }

  getDonationById(id) {
    return this.request(`/donations/${id}`);
  }

  createDonation(donationData) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  // Recipients / NGOs
  getRecipients(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/recipients${query ? `?${query}` : ''}`);
  }

  getPendingRecipients() {
    return this.request('/recipients/pending');
  }

  reviewRecipient(id, decision) {
    return this.request(`/recipients/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(decision),
    });
  }

  uploadNgoDocument(ngoId, formData) {
    return this.request(`/recipients/${ngoId}/documents`, {
      method: 'POST',
      body: formData,
    });
  }

  // Matches
  getNgoMatches(ngoId) {
    return this.request(`/matches/ngo/${ngoId}`);
  }

  respondToMatch(matchId, actionData) {
    return this.request(`/matches/${matchId}/respond`, {
      method: 'POST',
      body: JSON.stringify(actionData),
    });
  }

  // Drivers
  getDrivers() {
    return this.request('/drivers');
  }

  getDriverPickups(driverId) {
    return this.request(`/drivers/${driverId}/pickups`);
  }

  updatePickupStatus(assignmentId, statusData) {
    return this.request(`/drivers/assignments/${assignmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  // Certificates & Public Verification
  getCertificates() {
    return this.request('/certificates');
  }

  getCertificate(id) {
    return this.request(`/certificates/verify/${id}`);
  }

  verifyCertificate(id) {
    return this.request(`/certificates/verify/${id}`);
  }

  getLegalClause() {
    return this.request('/certificates/legal-clause');
  }

  acceptAndCertifyDonation(restaurantId, data = {}) {
    return this.request(`/restaurants/${restaurantId}/accept-and-certify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin KPIs & Live Map
  getAdminKPIs() {
    return this.request('/admin/kpis');
  }

  getLiveMapData() {
    return this.request('/admin/live-map');
  }

  // Nearby Restaurants & AI Outreach
  getNearbyRestaurants() {
    return this.request('/restaurants/nearby');
  }

  connectRestaurant(id, data = {}) {
    return this.request(`/restaurants/${id}/connect`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  simulateRestaurantReply(id, data = {}) {
    return this.request(`/restaurants/${id}/simulate-reply`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
export default api;
