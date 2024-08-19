import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateScheduledAt() {
  try {
    const evaluatedGames = await prisma.evaluatedGame.findMany();

    for (const game of evaluatedGames) {
      await prisma.evaluatedGame.update({
        where: { id: game.id },
        data: { scheduledAt: game.createdAt },
      });
    }

    console.log('Successfully updated scheduledAt for all evaluated games');
  } catch (error) {
    console.error('Error updating scheduledAt:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateScheduledAt();
