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
        select: {
          id: true,
          gameId: true,
          data: true,
          claudeResponse: true,
          gameOfTheDay: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json(todaysGames);
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
