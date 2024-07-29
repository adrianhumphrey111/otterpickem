import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveGameToDB(evaluatedGame, claudeResponse) {
  try {
    const savedGame = await prisma.evaluatedGame.create({
      data: {
        gameId: evaluatedGame.gameId,
        data: evaluatedGame,
        claudeResponse: claudeResponse,
      },
    });
    return savedGame;
  } catch (error) {
    console.error('Error saving game to database:', error);
    throw error;
  }
}
