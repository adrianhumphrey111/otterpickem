import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, description, releaseDate, genre, platform, developer, publisher, rating, price } = req.body;
      const game = await prisma.game.create({
        data: {
          name,
          description,
          releaseDate: new Date(releaseDate),
          genre,
          platform,
          developer,
          publisher,
          rating: parseFloat(rating),
          price: parseFloat(price),
        },
      });
      res.status(201).json(game);
    } catch (error) {
      res.status(500).json({ error: 'Error creating game', details: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const games = await prisma.game.findMany();
      res.status(200).json(games);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching games', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
