import { PrismaClient, SelectedOption as PrismaSelectedOption } from '@prisma/client';

const prisma = new PrismaClient();

export interface SelectedOption extends PrismaSelectedOption {}

export async function createSelectedOption(data: PrismaSelectedOption): Promise<SelectedOption> {
  return await prisma.selectedOption.create({
    data,
  });
}

export async function getSelectedOptionById(id: string): Promise<SelectedOption | null> {
  return await prisma.selectedOption.findUnique({
    where: { id },
  });
}