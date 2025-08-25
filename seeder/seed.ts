import { PrismaClient } from '@prisma/client';
import { MOVIES } from './movies.data';
import { OPTIONAL_PROPERTY_DEPS_METADATA } from '@nestjs/common/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data upload...');

  try {
    const result = await prisma.movie.createMany({ data: MOVIES });

    const numberPromocodes = 5;
    console.log(`Создание ${numberPromocodes} промокодов...`);
    for (let i = 0; i < numberPromocodes; i++) {
      const promo = await prisma.promoCode.create({
        data: {
          code: 'leto',
          discount: 20,
        },
      });
      console.log(`Промокод создан ${promo.code}`);
    }
  } catch (e) {
    console.log('Error during data upload:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnect from database');
  }
}

main();
