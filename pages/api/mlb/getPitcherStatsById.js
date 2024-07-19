import { getPitcherStats } from '../../../mlbServices/getMLBScheduleByDate';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function savePitcherStats(playerId, stats) {
  try {
    const playerStats = await prisma.playerStats.upsert({
      where: {
        playerId: playerId,
      },
      update: {
        currentStatsValue: stats,
        statType: 'pitching',
      },
      create: {
        playerId: playerId,
        statType: 'pitching',
        currentStatsValue: stats
      }
    });
    console.log('Pitcher stats saved:', playerStats)
    return playerStats
  } catch (error) {
    console.error('Error saving pitcher stats:', error)
    throw error
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Pitcher ID is required' });
      }

      const player = await prisma.player.findUnique({
        where: { id: parseInt(id) },
      });

      if (!player) {
        return res.status(404).json({ error: 'Pitcher not found' });
      }

      const stats = await getPitcherStats(player.fanGraphsPlayerUrl);
      await savePitcherStats(player.id, stats)

      res.status(200).json(stats);
    } catch (error) {
      console.error('Error in getPitcherStatsById:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
