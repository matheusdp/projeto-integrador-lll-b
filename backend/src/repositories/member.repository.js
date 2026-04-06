const prisma = require('../config/prisma');

async function findMembers(projectId) {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
}

async function addMember(projectId, userId) {
  return prisma.projectMember.create({
    data: { projectId, userId, role: 'MEMBER' },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
}

async function removeMember(projectId, userId) {
  return prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } }
  });
}

async function findMember(projectId, userId) {
  return prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  });
}

module.exports = { findMembers, addMember, removeMember, findMember };
