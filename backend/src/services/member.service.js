const memberRepo = require('../repositories/member.repository');
const projectRepo = require('../repositories/project.repository');
const authRepo = require('../repositories/auth.repository');
const AppError = require('../utils/AppError');

async function getMembers(projectId, userId) {
  const isMember = await projectRepo.isMember(projectId, userId);
  if (!isMember) throw new AppError('Acesso negado', 403);
  return memberRepo.findMembers(projectId);
}

async function addMember(projectId, { email }, userId) {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new AppError('Projeto não encontrado', 404);
  if (project.ownerId !== userId) throw new AppError('Apenas o dono pode adicionar membros', 403);

  const userToAdd = await authRepo.findByEmail(email);
  if (!userToAdd) throw new AppError('Usuário não encontrado', 404);

  const alreadyMember = await memberRepo.findMember(projectId, userToAdd.id);
  if (alreadyMember) throw new AppError('Usuário já é membro do projeto', 409);

  return memberRepo.addMember(projectId, userToAdd.id);
}

async function removeMember(projectId, targetUserId, userId) {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new AppError('Projeto não encontrado', 404);
  if (project.ownerId !== userId) throw new AppError('Apenas o dono pode remover membros', 403);
  if (targetUserId === userId) throw new AppError('O dono não pode ser removido do projeto', 400);

  const member = await memberRepo.findMember(projectId, targetUserId);
  if (!member) throw new AppError('Usuário não é membro do projeto', 404);

  return memberRepo.removeMember(projectId, targetUserId);
}

module.exports = { getMembers, addMember, removeMember };
