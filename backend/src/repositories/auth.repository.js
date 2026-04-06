const prisma = require('../config/prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function createUser({ name, email, password }) {
  return prisma.user.create({
    data: { name, email, password },
    select: { id: true, name: true, email: true, createdAt: true }
  });
}

module.exports = { findByEmail, createUser };
