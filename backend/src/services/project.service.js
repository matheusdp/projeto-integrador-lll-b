const projectRepo = require('../repositories/project.repository');
const AppError = require('../utils/AppError');

async function getAll(userId) {
  return projectRepo.findAllByUser(userId);
}

async function getById(id, userId) {
  const project = await projectRepo.findById(id);
  if (!project) throw new AppError('Projeto não encontrado', 404);

  const isMember = await projectRepo.isMember(id, userId);
  if (!isMember) throw new AppError('Acesso negado', 403);

  return project;
}

async function create({ name, description }, userId) {
  if (!name) throw new AppError('Nome do projeto é obrigatório');
  return projectRepo.create({ name, description, ownerId: userId });
}

async function update(id, data, userId) {
  const project = await projectRepo.findById(id);
  if (!project) throw new AppError('Projeto não encontrado', 404);
  if (project.ownerId !== userId) throw new AppError('Apenas o dono pode editar o projeto', 403);

  if (!data.name) throw new AppError('Nome do projeto é obrigatório');
  return projectRepo.update(id, data);
}

async function remove(id, userId) {
  const project = await projectRepo.findById(id);
  if (!project) throw new AppError('Projeto não encontrado', 404);
  if (project.ownerId !== userId) throw new AppError('Apenas o dono pode excluir o projeto', 403);

  return projectRepo.remove(id);
}

module.exports = { getAll, getById, create, update, remove };
