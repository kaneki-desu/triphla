// lib/prisma.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const connectionString = process.env.DATABASE_URL;

// Create the Prisma adapter
const adapter = new PrismaPg({ connectionString });

// Singleton pattern for Next.js / Turbopack

export const prisma =
  globalThis.prismaGlobal ||
  new PrismaClient({ adapter });

// Only set global in dev
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
