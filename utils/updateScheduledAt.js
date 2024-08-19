import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateScheduledAt() {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const evaluatedGames = await prisma.evaluatedGame.findMany({
        select: { id: true, createdAt: true }
      });

      const updatePromises = evaluatedGames.map(game =>
        prisma.evaluatedGame.update({
          where: { id: game.id },
          data: { scheduledAt: game.createdAt },
        })
      );

      return await Promise.all(updatePromises);
    });

    console.log(`Successfully updated scheduledAt for ${result.length} evaluated games`);
  } catch (error) {
    console.error('Error updating scheduledAt:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateScheduledAt();
