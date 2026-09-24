import api from './api';

export const itemService = {
  // Get items with search & filters
  getItems: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  // Get item by ID
  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Report new item
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Update item
  updateItem: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};

export default itemService;
