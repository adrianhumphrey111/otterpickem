import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Create the start and end of the day in UTC
      const targetDate = new Date();
      const startOfDay = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0));
      const endOfDay = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999));

      // Log the date ranges for debugging
      console.log('Querying from:', startOfDay.toISOString(), 'to:', endOfDay.toISOString());
      
      // Query for the game of the day
      const gameOfTheDay = await prisma.game.findFirst({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          gameOfTheDay: true,
        },
        include: {
          awayStartingPitcher: true, 
          homeStartingPitcher: true,
          homeTeam: true,
          awayTeam: true
        },
      });

      if (gameOfTheDay) {
        res.status(200).json(gameOfTheDay);
      } else {
        res.status(404).json({ error: 'Game of the day not found' });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
