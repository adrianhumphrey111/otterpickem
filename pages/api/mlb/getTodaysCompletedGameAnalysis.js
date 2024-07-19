import { getPitcherStats } from '../../../mlbServices/getMLBScheduleByDate';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // getMonth() returns 0-based month, so add 1
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        // Create the start and end of the day in UTC
        const targetDate = new Date();
        const startOfDay = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999));

        // Log the date ranges for debugging
        console.log('Querying from:', startOfDay.toISOString(), 'to:', endOfDay.toISOString());
        
        // Query with include for awayStartingPitcher
        const games = await prisma.game.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                awayStartingPitcher: true, 
                homeStartingPitcher: true,
                homeTeam: true,
                awayTeam: true
            },
        });
      res.status(200).json(games)

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
