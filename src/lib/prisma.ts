import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Pooled connection is fine for runtime queries
const connectionString = `${process.env.DATABASE_URL}`;
const REQUIRED_MODEL_DELEGATES = [
  "user",
  "store",
  "product",
  "order",
  "orderItem",
  "review",
  "withdrawal",
  "linkedPayment",
] as const;

// Prevent multiple Prisma Client & Pool instances in development (Next.js hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma_v5: PrismaClient | undefined;
  pool_v5: pg.Pool | undefined;
};

const createPrisma = () => {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  return { client, pool };
};

const hasRequiredDelegates = (client: PrismaClient) =>
  REQUIRED_MODEL_DELEGATES.every((delegate) => delegate in (client as object));

const getPrisma = () => {
  const cachedClient = globalForPrisma.prisma_v5;
  const cachedPool = globalForPrisma.pool_v5;

  if (cachedClient && cachedPool && hasRequiredDelegates(cachedClient)) {
    return { client: cachedClient, pool: cachedPool };
  }

  return createPrisma();
};

const { client: prisma, pool } = getPrisma();

export { prisma };

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_v5 = prisma;
  globalForPrisma.pool_v5 = pool;
}
