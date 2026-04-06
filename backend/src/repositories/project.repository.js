const prisma = require('../config/prisma');

async function findAllByUser(userId) {
  return prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } }
      ]
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, members: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function findById(id) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true } } }
      },
      _count: { select: { tasks: true } }
    }
  });
}

async function create({ name, description, ownerId }) {
  return prisma.project.create({
    data: {
      name,
      description,
      ownerId,
      members: {
        create: { userId: ownerId, role: 'OWNER' }
      }
    },
    include: {
      owner: { select: { id: true, name: true, email: true } }
    }
  });
}

async function update(id, { name, description }) {
  return prisma.project.update({
    where: { id },
    data: { name, description }
  });
}

async function remove(id) {
  return prisma.project.delete({ where: { id } });
}

async function isMember(projectId, userId) {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  });
  return !!member;
}

module.exports = { findAllByUser, findById, create, update, remove, isMember };
