import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { gameId } = req.query;

    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }

    try {
      const game = await prisma.evaluatedGame.findUnique({
        where: {
          gameId: gameId,
        },
      });

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.status(200).json(game);
    } catch (error) {
      console.error('Error fetching game details:', error);
      res.status(500).json({ error: 'An error occurred while fetching game details' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
