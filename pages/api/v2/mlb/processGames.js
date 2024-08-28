import { PrismaClient } from '@prisma/client';
import { processGame } from '../../../../utils/mlbGameProcessing';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Send an immediate response
  res.status(200).json({ message: 'Game processing started' });

  try {
    const startTime = Date.now();
    const timeLimit = 290000; // 4 minutes 50 seconds in milliseconds (leaving a 10-second buffer)

    let processedCount = 0;
    let hasMoreGames = true;

    while (Date.now() - startTime < timeLimit && hasMoreGames) {
      const queuedGame = await prisma.gameQueue.findFirst({
        where: { status: 'PENDING' },
      });

      if (!queuedGame) {
        hasMoreGames = false;
        break;
      }

      await processGame(queuedGame.gameId);

      await prisma.gameQueue.update({
        where: { id: queuedGame.id },
        data: { status: 'PROCESSED' }
      });

      processedCount++;
    }

    console.log(`Processed ${processedCount} games`);

    // If there are more games to process, trigger the function again
    if (hasMoreGames) {
      await triggerProcessingFunction();
    }

  } catch (error) {
    console.error('Error processing games:', error);
  }
}

async function triggerProcessingFunction() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/processGames`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger processing: ${response.statusText}`);
    }

    console.log('Triggered next batch of processing');
  } catch (error) {
    console.error('Failed to trigger next batch:', error);
  }
}