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