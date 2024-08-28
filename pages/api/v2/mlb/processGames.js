import { PrismaClient } from '@prisma/client';
import { processGame } from '../../../../utils/mlbGameProcessing';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Send an immediate response
  res.status(200).json({ message: 'Game processing started' });

  try {
    const startTime = Date.now();
    const timeLimit = 300000; // 5 minutes in milliseconds

    while (Date.now() - startTime < timeLimit) {
      const queuedGame = await prisma.gameQueue.findFirst({
        where: { status: 'PENDING' },
      });

      if (!queuedGame) {
        console.log('No more games to process');
        break;
      }

      await processGame(queuedGame.gameId);

      await prisma.gameQueue.update({
        where: { id: queuedGame.id },
        data: { status: 'PROCESSED' }
      });
    }

    console.log('Finished processing games or reached time limit');
  } catch (error) {
    console.error('Error processing games:', error);
  }
}