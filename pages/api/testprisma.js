import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, description } = req.body;
      const game = await prisma.game.create({
        data: {
          name,
          description,
        },
      });
      res.status(201).json(game);
    } catch (error) {
      res.status(500).json({ error: 'Error creating game' });
    }
  } else if (req.method === 'GET') {
    try {
      const games = await prisma.game.findMany();
      res.status(200).json(games);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching games' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
