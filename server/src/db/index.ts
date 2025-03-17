import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    console.log("Connected to PostgreSQL!");
  })
  .catch((err: Error) => {
    console.error("Error connecting to PostgreSQL: ", err);
  });

export default prisma;