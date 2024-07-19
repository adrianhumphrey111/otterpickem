import { PrismaClient } from '@prisma/client';
import { getPitcherStats } from '../../../mlbServices/getMLBScheduleByDate';

const prisma = new PrismaClient();

async function savePitcherStats(playerId, stats) {
  try {
    const playerStats = await prisma.playerStats.create({
      data: {
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

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const games = await prisma.game.findMany({
        include: {
          homeTeam: true,
          awayTeam: true,
          homeStartingPitcher: true,
          awayStartingPitcher: true,
        },
      });

      for (const game of games) {
        // Process away pitcher
        if (game.awayStartingPitcher && game.awayStartingPitcher.fanGraphsPlayerUrl) {
          const awayPitcherStats = await getPitcherStats(game.awayStartingPitcher.fanGraphsPlayerUrl);
          await savePitcherStats(game.awayStartingPitcher.id, awayPitcherStats);
        }

        // Process home pitcher
        if (game.homeStartingPitcher && game.homeStartingPitcher.fanGraphsPlayerUrl) {
          const homePitcherStats = await getPitcherStats(game.homeStartingPitcher.fanGraphsPlayerUrl);
          await savePitcherStats(game.homeStartingPitcher.id, homePitcherStats);
        }

        // Delay for 10 seconds before processing the next game
        await delay(10000);
      }

      res.status(200).json({ message: 'All MLB game stats processed and saved successfully' });
    } catch (error) {
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
