import { PrismaClient } from '@prisma/client';
import { getPitcherStats } from '../../../mlbServices/getMLBScheduleByDate';
import { delay } from '../../../utils/delayUtil';

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
    console.log('Pitcher stats saved:', playerStats);
    return playerStats;
  } catch (error) {
    console.error('Error saving pitcher stats:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const players = await prisma.player.findMany()
      const playerStats = await prisma.playerStats.findMany()

      const findPlayers = players.filter(player => !playerStats.some(s => s.playerId === player.id));

      // Use for await...of to process players sequentially with delay
    for await (const [index, player] of findPlayers.entries()) {
      if (player) {
        const pitcherStats = await getPitcherStats(player.fanGraphsPlayerUrl);
        await savePitcherStats(player.id, pitcherStats);

        // Delay for 4 minutes (240000 ms) before processing the next player
        await delay(240000);
      }
    }
    
    res.status(200).json({ message: 'All MLB game stats processed and saved successfully' });
      console.error('Error in getAllMlbGameStats:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
