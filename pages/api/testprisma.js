import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { date, time, homeTeamId, awayTeamId, espnBetHomeOdds, espnBetAwayOdds, status, sport } = req.body;
      const game = await prisma.game.create({
        data: {
          date: new Date(date),
          time,
          homeTeamId: parseInt(homeTeamId),
          awayTeamId: parseInt(awayTeamId),
          espnBetHomeOdds: espnBetHomeOdds ? parseFloat(espnBetHomeOdds) : null,
          espnBetAwayOdds: espnBetAwayOdds ? parseFloat(espnBetAwayOdds) : null,
          status,
          sport
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
    // ... (GET method remains unchanged)
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}