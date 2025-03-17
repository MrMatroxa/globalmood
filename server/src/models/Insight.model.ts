import { PrismaClient, Insight as PrismaInsight, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface Insight extends PrismaInsight {}

export async function createInsight(data: Prisma.InsightCreateInput): Promise<Insight> {
  return await prisma.insight.create({
    data,
  });
}

export async function getInsightById(id: string): Promise<Insight | null> {
  return await prisma.insight.findUnique({
    where: { id },
  });
}