const taskRepo = require('../repositories/task.repository');
const projectRepo = require('../repositories/project.repository');
const AppError = require('../utils/AppError');

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

async function getByProject(projectId, userId) {
  const isMember = await projectRepo.isMember(projectId, userId);
  if (!isMember) throw new AppError('Acesso negado', 403);
  return taskRepo.findByProject(projectId);
}

async function create({ title, description, assigneeId, dueDate }, projectId, userId) {
  if (!title) throw new AppError('Título da tarefa é obrigatório');

  const isMember = await projectRepo.isMember(projectId, userId);
  if (!isMember) throw new AppError('Acesso negado', 403);

  const tasks = await taskRepo.findByProject(projectId);
  const order = tasks.filter(t => t.status === 'TODO').length;

  return taskRepo.create({ title, description, projectId, assigneeId, dueDate, order });
}

async function update(id, data, userId) {
  const task = await taskRepo.findById(id);
  if (!task) throw new AppError('Tarefa não encontrada', 404);

  const isMember = await projectRepo.isMember(task.projectId, userId);
  if (!isMember) throw new AppError('Acesso negado', 403);

  if (!data.title) throw new AppError('Título da tarefa é obrigatório');
  return taskRepo.update(id, data);
}

async function updateStatus(id, { status, order }, userId) {
  const task = await taskRepo.findById(id);
  if (!task) throw new AppError('Tarefa não encontrada', 404);

  const isMember = await projectRepo.isMember(task.projectId, userId);
  if (!isMember) throw new AppError('Acesso negado', 403);

  if (!VALID_STATUSES.includes(status)) {
    throw new AppError(`Status inválido. Use: ${VALID_STATUSES.join(', ')}`);
  }

  return taskRepo.updateStatus(id, { status, order: order ?? task.order });
}

async function remove(id, userId) {
  const task = await taskRepo.findById(id);
  if (!task) throw new AppError('Tarefa não encontrada', 404);

  const isMember = await projectRepo.isMember(task.projectId, userId);
  if (!isMember) throw new AppError('Acesso negado', 403);

  return taskRepo.remove(id);
}

module.exports = { getByProject, create, update, updateStatus, remove };
