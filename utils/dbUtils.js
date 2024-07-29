import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveGameToDB(evaluatedGame) {
  try {
    const savedGame = await prisma.evaluatedGame.create({
      data: {
        gameId: evaluatedGame.gameId,
        data: evaluatedGame,
      },
    });
    return savedGame;
  } catch (error) {
    console.error('Error saving game to database:', error);
    throw error;
  }
}
