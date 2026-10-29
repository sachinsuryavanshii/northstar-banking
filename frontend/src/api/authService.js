import client from './client';

export const authService = {
  async register(data) {
    const response = await client.post('/api/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await client.post('/api/auth/login', credentials);
    return response.data;
  },

  async getMe() {
    const response = await client.get('/api/auth/me');
    return response.data;
  },
};
