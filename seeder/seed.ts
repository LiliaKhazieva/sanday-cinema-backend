import { PrismaClient } from '@prisma/client';
import { MOVIES } from './movies.data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data upload...');

  try {
    const result = await prisma.movie.createMany({ data: MOVIES });
  } catch (e) {
    console.log('Error during data upload:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnect from database');
  }
}

main();
