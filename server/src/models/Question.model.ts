import { PrismaClient, Question as PrismaQuestion } from '@prisma/client';

const prisma = new PrismaClient();

export interface Question extends PrismaQuestion {}

export async function createQuestion(data: PrismaQuestion): Promise<Question> {
  return await prisma.question.create({
    data,
  });
}

export async function getQuestionById(id: string): Promise<Question | null> {
  return await prisma.question.findUnique({
    where: { id },
  });
}