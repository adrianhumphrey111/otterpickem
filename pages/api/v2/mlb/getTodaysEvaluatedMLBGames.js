import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getStartAndEndOfDayET(date) {
  // Convert the given date to Eastern Time (ET)
  const etDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));

  // Create start of the day in ET
  const startOfDayET = new Date(etDate);
  startOfDayET.setHours(0, 0, 0, 0);

  // Create end of the day in ET
  const endOfDayET = new Date(etDate);
  endOfDayET.setHours(23, 59, 59, 999);

  // Convert ET times back to UTC
  const startOfDayUTC = new Date(startOfDayET.toISOString());
  const endOfDayUTC = new Date(endOfDayET.toISOString());

  console.log('Start of day ET (UTC):', startOfDayUTC.toISOString());
  console.log('End of day ET (UTC):', endOfDayUTC.toISOString());

  return { startOfDayUTC, endOfDayUTC };
}


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const today = new Date();
      console.log('Current UTC time:', today.toISOString());
      const { startOfDayET, endOfDayET } = getStartAndEndOfDayET(today);
      const { startOfDayUTC, endOfDayUTC } = getStartAndEndOfDayET(today);


      const todaysGames = await prisma.evaluatedGame.findMany({
        where: {
          scheduledAt: {
            gte: startOfDayUTC,
            lte: endOfDayUTC,
          },
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      });

      console.log('Number of games found:', todaysGames.length);
      console.log('Games:', todaysGames.map(g => ({
        id: g.id,
        scheduledAt: new Date(g.scheduledAt).toLocaleString('en-US', { timeZone: 'America/New_York' })
      })));

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