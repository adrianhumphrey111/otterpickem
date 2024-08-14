import { evaluateGame } from './getGameById';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { gameIds } = req.body;

      if (!Array.isArray(gameIds)) {
        return res.status(400).json({ message: 'gameIds must be an array' });
      }

      const evaluatedGames = [];
      for (let i = 0; i < gameIds.length; i++) {
        const gameId = gameIds[i];
        
        // Check if the game has already been evaluated
        const existingEvaluatedGame = await prisma.evaluatedGame.findUnique({
          where: { gameId: gameId },
        });

        if (existingEvaluatedGame) {
          console.log(`Game ${gameId} already evaluated. Skipping.`);
          evaluatedGames.push(existingEvaluatedGame.data);
        } else {
          const evaluatedGame = await evaluateGame(gameId);
          evaluatedGames.push(evaluatedGame);
        }
      }
      
      res.status(200).json(evaluatedGames);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
