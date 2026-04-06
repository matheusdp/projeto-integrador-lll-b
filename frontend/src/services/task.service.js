import api from './api';

export const taskService = {
  async getByProject(projectId) {
    const res = await api.get(`/projects/${projectId}/tasks`);
    return res.data;
  },

  async create(projectId, data) {
    const res = await api.post(`/projects/${projectId}/tasks`, data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  async updateStatus(id, status, order) {
    const res = await api.patch(`/tasks/${id}/status`, { status, order });
    return res.data;
  },

  async remove(id) {
    await api.delete(`/tasks/${id}`);
  }
};
