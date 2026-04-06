import api from './api';

export const projectService = {
  async getAll() {
    const res = await api.get('/projects');
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/projects', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },

  async remove(id) {
    await api.delete(`/projects/${id}`);
  },

  async getMembers(id) {
    const res = await api.get(`/projects/${id}/members`);
    return res.data;
  },

  async addMember(id, email) {
    const res = await api.post(`/projects/${id}/members`, { email });
    return res.data;
  },

  async removeMember(id, userId) {
    await api.delete(`/projects/${id}/members/${userId}`);
  }
};
