import { PrismaClient, User as PrismaUser } from '@prisma/client';

const prisma = new PrismaClient();

export interface User extends PrismaUser {}

export async function createUser(ip: string): Promise<User> {
  return await prisma.user.create({
    data: {
      ip: ip,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}