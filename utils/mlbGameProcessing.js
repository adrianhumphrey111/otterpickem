import { PrismaClient } from '@prisma/client';
import { evaluateGame } from '../pages/api/v2/mlb/getGameById';

const prisma = new PrismaClient();

export async function processGame(gameId) {
  try {
    // Check if the game has already been evaluated
    const existingEvaluatedGame = await prisma.evaluatedGame.findUnique({
      where: { gameId: gameId },
    });

    if (existingEvaluatedGame) {
      console.log(`Game ${gameId} already evaluated. Skipping.`);
    } else {
      await evaluateGame(gameId);
      console.log(`Game ${gameId} evaluated and saved.`);
    }
  } catch (error) {
    console.error(`Error processing game ${gameId}:`, error);
    throw error;
  }
}