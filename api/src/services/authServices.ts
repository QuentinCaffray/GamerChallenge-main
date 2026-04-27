import argon2 from 'argon2';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import type { RegisterInput } from '../schemas/authSchemas.js';
import type { LoginInput } from '../schemas/authSchemas.js';

//  Hash du mot de passe
export const register = async (data: RegisterInput) => {
  const hashedPassword = await argon2.hash(data.password);

  //  Créé l'utilisateur dans la BDD
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword
      }
    });
    //  Retire le mdp avant de retourner
    const {
      password: _1,
      email: _2,
      isDeleted: _3,
      deletedAt: _4,
      createdAt: _5,
      updatedAt: _6,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  } catch (error: any) {
    //  Erreur si le user existe déjà
    if (error.code === 'P2002') {
      throw new AppError('Email or username already in use', 409);
    }

    throw error;
  }
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await argon2.verify(user.password, data.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // j'ai ajouté ici gestion des comptes supprimé / banni
  if (user.isDeleted) {
    throw new AppError('User account deleted or not found', 403);
  }
  const {
    password: _1,
    email: _2,
    isDeleted: _3,
    deletedAt: _4,
    createdAt: _5,
    updatedAt: _6,
    ...userWithoutPassword
  } = user;
  return userWithoutPassword;
};

// Récupérer un utilisateur par son ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      role: true,
      isBanned: true,
      bannedAt: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
