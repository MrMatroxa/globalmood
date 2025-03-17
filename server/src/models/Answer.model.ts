import { PrismaClient, Answer as PrismaAnswer } from '@prisma/client';

const prisma = new PrismaClient();

export interface Answer extends PrismaAnswer {}

export async function createAnswer(data: PrismaAnswer): Promise<Answer> {
  return await prisma.answer.create({
    data,
  });
}

export async function getAnswerById(id: string): Promise<Answer | null> {
  return await prisma.answer.findUnique({
    where: { id },
  });
}