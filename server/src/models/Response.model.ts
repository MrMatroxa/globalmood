import { PrismaClient, Response as PrismaResponse } from '@prisma/client';

const prisma = new PrismaClient();

export interface Response extends PrismaResponse {}

export async function createResponse(data: PrismaResponse): Promise<Response> {
  return await prisma.response.create({
    data,
  });
}

export async function getResponseById(id: string): Promise<Response | null> {
  return await prisma.response.findUnique({
    where: { id },
  });
}

// Add this function to check if user has already submitted a response today
export async function hasUserVotedToday(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Check if user already has a response for today
  const responseCount = await prisma.response.count({
    where: {
      userId: userId,
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    }
  });
  
  return responseCount > 0;
}