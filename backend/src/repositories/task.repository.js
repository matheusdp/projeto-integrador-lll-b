const prisma = require('../config/prisma');

async function findByProject(projectId) {
  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: { select: { id: true, name: true, email: true } }
    },
    orderBy: [{ status: 'asc' }, { order: 'asc' }]
  });
}

async function findById(id) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      assignee: { select: { id: true, name: true, email: true } }
    }
  });
}

async function create({ title, description, projectId, assigneeId, dueDate, order }) {
  return prisma.task.create({
    data: { title, description, projectId, assigneeId, dueDate, order: order || 0 },
    include: {
      assignee: { select: { id: true, name: true, email: true } }
    }
  });
}

async function update(id, data) {
  return prisma.task.update({
    where: { id },
    data,
    include: {
      assignee: { select: { id: true, name: true, email: true } }
    }
  });
}

async function updateStatus(id, { status, order }) {
  return prisma.task.update({
    where: { id },
    data: { status, order }
  });
}

async function remove(id) {
  return prisma.task.delete({ where: { id } });
}

module.exports = { findByProject, findById, create, update, updateStatus, remove };
