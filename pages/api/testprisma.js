import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { date, time, homeTeamId, awayTeamId, espnBetHomeOdds, espnBetAwayOdds, status } = req.body;
      const game = await prisma.game.create({
        data: {
          date: new Date(date),
          time,
          homeTeamId: parseInt(homeTeamId),
          awayTeamId: parseInt(awayTeamId),
          espnBetHomeOdds: espnBetHomeOdds ? parseFloat(espnBetHomeOdds) : null,
          espnBetAwayOdds: espnBetAwayOdds ? parseFloat(espnBetAwayOdds) : null,
          status,
        },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      });
      res.status(201).json(game);
    } catch (error) {
      res.status(500).json({ error: 'Error creating game', details: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const games = await prisma.game.findMany({
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      });
      res.status(200).json(games);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching games', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
