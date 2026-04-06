const bcrypt = require('bcryptjs');
const { findByEmail, createUser } = require('../repositories/auth.repository');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new AppError('Nome, email e senha são obrigatórios');
  }

  const existing = await findByEmail(email);
  if (existing) {
    throw new AppError('Email já cadastrado', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword });

  const token = generateToken({ id: user.id, email: user.email });
  return { user, token };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError('Email e senha são obrigatórios');
  }

  const user = await findByEmail(email);
  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const token = generateToken({ id: user.id, email: user.email });
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

module.exports = { register, login };
