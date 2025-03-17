import { PrismaClient, Profile as PrismaProfile } from '@prisma/client';

const prisma = new PrismaClient();

export interface Profile extends PrismaProfile {}

export async function createProfile(data: PrismaProfile): Promise<Profile> {
  return await prisma.profile.create({
    data,
  });
}

export async function getProfileById(id: string): Promise<Profile | null> {
  return await prisma.profile.findUnique({
    where: { id },
  });
}