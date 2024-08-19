const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateScheduledAt() {
  try {
    const batchSize = 100; // Process 100 games at a time
    let offset = 0;
    let totalUpdated = 0;

    while (true) {
      const evaluatedGames = await prisma.evaluatedGame.findMany({
        select: { id: true, createdAt: true },
        skip: offset,
        take: batchSize,
      });

      if (evaluatedGames.length === 0) break;

      const result = await prisma.$transaction(
        evaluatedGames.map(game =>
          prisma.evaluatedGame.update({
            where: { id: game.id },
            data: { scheduledAt: game.createdAt },
          })
        ),
        {
          timeout: 30000, // 30 seconds timeout for each batch
        }
      );

      totalUpdated += result.length;
      console.log(`Updated ${result.length} games in this batch`);

      offset += batchSize;
    }

    console.log(`Successfully updated scheduledAt for ${totalUpdated} evaluated games`);
  } catch (error) {
    console.error('Error updating scheduledAt:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateScheduledAt();
