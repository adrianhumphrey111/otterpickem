import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      const todaysGames = await prisma.evaluatedGame.findMany({
        where: {
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // TODO: save the games by scheduled
      const sortedGames = todaysGames.sort( (a, b) => new Date(a.data.boxScore.scheduled) - new Date(b.data.boxScore.scheduled))

      console.log(sortedGames.map( g => g.data.boxScore.scheduled))
      res.status(200).json(sortedGames);
    } catch (error) {
      console.error('Error fetching today\'s evaluated MLB games:', error);
      res.status(500).json({ error: 'An error occurred while fetching today\'s evaluated MLB games' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
