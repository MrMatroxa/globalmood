import { PrismaClient, Survey as PrismaSurvey } from '@prisma/client';

const prisma = new PrismaClient();

export interface Survey extends PrismaSurvey {}

export async function createSurvey(data: PrismaSurvey): Promise<Survey> {
  return await prisma.survey.create({
    data,
  });
}

export async function getSurveyById(id: string): Promise<Survey | null> {
  return await prisma.survey.findUnique({
    where: { id },
  });
}