import { PrismaClient, User as PrismaUser } from "@prisma/client";

const prisma = new PrismaClient();

export interface User extends PrismaUser {}

export async function findOrCreateUser(ip: string, country: string): Promise<User> {
  // First check if a user with this IP already exists
  const existingUser = await prisma.user.findFirst({
    where: { ip },
    include: { profile: true },
  });

  if (existingUser) {
    // If the user exists but the profile doesn't have the country, update it
    if (!existingUser.profile || existingUser.profile.country !== country) {
      await prisma.profile.upsert({
        where: { userId: existingUser.id },
        update: { country },
        create: { userId: existingUser.id, country },
      });
    }
    return existingUser;
  }

  // Otherwise create a new user
  return await prisma.user.create({
    data: {
      ip: ip,
      profile: {
        create: {
          country,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: { profile: true },
  });
}

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
    include: {
      responses: true,
    },
  });
}

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany({
    include: {
      responses: true,
    },
  });
}


