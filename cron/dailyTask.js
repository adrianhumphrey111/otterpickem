import { PrismaClient } from '@prisma/client';
import { getGameById } from '../pages/api/v2/mlb/getGameById';

const prisma = new PrismaClient();

export async function dailyTask() {
  console.log('Running daily task at', new Date().toISOString());

  try {
    // Fetch today's games
    const today = new Date();
    const games = await prisma.game.findMany({
      where: {
        date: today,
        status: 'scheduled'
      }
    });

    // Process each game
    for (const game of games) {
      await getGameById({ query: { gameId: game.id } }, { status: () => {}, json: () => {} });
    }

    console.log('Daily task completed successfully');
  } catch (error) {
    console.error('Error in daily task:', error);
  }
}
