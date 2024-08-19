import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getStartAndEndOfDay(date, timeZone) {
  const options = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);
  const dateObj = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  const year = parseInt(dateObj.year, 10);
  const month = parseInt(dateObj.month, 10) - 1; // JavaScript months are 0-indexed
  const day = parseInt(dateObj.day, 10);

  const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

  return { startOfDay, endOfDay };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const timeZone = 'America/New_York';
      const today = new Date();
      const { startOfDay: startOfTodayET, endOfDay: endOfTodayET } = getStartAndEndOfDay(today, timeZone);

      const todaysGames = await prisma.evaluatedGame.findMany({
        where: {
          scheduledAt: {
            gte: startOfTodayET,
            lte: endOfTodayET,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const sortedGames = todaysGames.sort((a, b) => new Date(a.data.boxScore.scheduled) - new Date(b.data.boxScore.scheduled));

      console.log(sortedGames.map(g => g.data.boxScore.scheduled));
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