import { PrismaClient } from '@prisma/client';
import { getScheduleByDate } from '../../../utils/mlbScheduleUtils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Verify that this is a cron job request
//   if (req.headers['x-vercel-cron'] !== 'true') {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    const games = await getScheduleByDate(year, month, date);

    for (const game of games) {
      await prisma.gameQueue.upsert({
        where: { gameId: game.id },
        update: {},
        create: {
          gameId: game.id,
          status: 'PENDING'
        }
      });
    }

    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/processGames`)
    

    // Trigger processing
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/mlb/processGames`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        res.status(200).json({ message: `${games.length} games queued for processing` });
    } catch (error) {
        console.error('Failed to trigger game processing:', error);
    }
  } catch (error) {
    console.error('Error queueing games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}