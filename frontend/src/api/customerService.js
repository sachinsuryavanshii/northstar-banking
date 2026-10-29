import client from './client';

export const customerService = {
  async getAll(params = {}) {
    const response = await client.get('/api/customers', { params });
    return response.data;
  },

  async getById(id) {
    const response = await client.get(`/api/customers/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await client.post('/api/customers', data);
    return response.data;
  },

  async update(id, data) {
    const response = await client.put(`/api/customers/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await client.delete(`/api/customers/${id}`);
    return response.data;
  },
};
