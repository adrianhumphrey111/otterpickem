import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getStartAndEndOfDayET(date) {
  const etDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  // Set to start of day in ET
  etDate.setHours(0, 0, 0, 0);
  
  // Convert back to UTC
  const startOfDayET = new Date(etDate.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  // Set to end of day in ET
  etDate.setHours(23, 59, 59, 999);
  
  // Convert back to UTC
  const endOfDayET = new Date(etDate.toLocaleString('en-US', { timeZone: 'America/New_York' }));

  return { startOfDayET, endOfDayET };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const today = new Date();
      const { startOfDayET, endOfDayET } = getStartAndEndOfDayET(today);

      const todaysGames = await prisma.evaluatedGame.findMany({
        where: {
          scheduledAt: {
            gte: startOfDayET,
            lte: endOfDayET,
          },
        },
        orderBy: {
          scheduledAt: 'asc',  // Changed to 'asc' to sort chronologically
        },
      });

      console.log(todaysGames.map(g => new Date(g.scheduledAt).toLocaleString('en-US', { timeZone: 'America/New_York' })));
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