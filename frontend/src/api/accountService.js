import client from './client';

export const accountService = {
  async getAll(params = {}) {
    const response = await client.get('/api/accounts', { params });
    return response.data;
  },

  async getById(id) {
    const response = await client.get(`/api/accounts/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await client.post('/api/accounts', data);
    return response.data;
  },

  async update(id, data) {
    const response = await client.put(`/api/accounts/${id}`, data);
    return response.data;
  },

  async deposit(id, amount) {
    const response = await client.post(`/api/accounts/${id}/deposit`, { amount });
    return response.data;
  },

  async withdraw(id, amount) {
    const response = await client.post(`/api/accounts/${id}/withdraw`, { amount });
    return response.data;
  },

  async delete(id) {
    const response = await client.delete(`/api/accounts/${id}`);
    return response.data;
  },
};
