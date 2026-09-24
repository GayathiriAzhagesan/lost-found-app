import api from './api';

export const claimService = {
  // Create claim
  createClaim: async (claimData) => {
    const response = await api.post('/claims', claimData);
    return response.data;
  },

  // Get claims (with optional filters: item, myClaims)
  getClaims: async (params = {}) => {
    const response = await api.get('/claims', { params });
    return response.data;
  },

  // Get claim by ID
  getClaimById: async (id) => {
    const response = await api.get(`/claims/${id}`);
    return response.data;
  },

  // Update claim status (approve/reject)
  updateClaimStatus: async (id, statusData) => {
    const response = await api.put(`/claims/${id}`, statusData);
    return response.data;
  },

  // Cancel/delete claim
  deleteClaim: async (id) => {
    const response = await api.delete(`/claims/${id}`);
    return response.data;
  },
};

export default claimService;
