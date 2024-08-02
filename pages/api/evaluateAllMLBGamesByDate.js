import { getScheduleByDate } from '../../utils/mlbScheduleUtils';
import { evaluateGame } from '../api/v2/mlb/getGameById';
import { PrismaClient } from '@prisma/client';
delete require.cache[require.resolve('dotenv')]
require('dotenv').config(); // Make sure to install dotenv and create a .env file with your API key

const prisma = new PrismaClient();


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
      const date = currentDate.getDate();

      const games = await getScheduleByDate(year, month, date);
      
      const evaluatedGames = [];
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        
        // Check if the game has already been evaluated
        // const existingEvaluatedGame = await prisma.evaluatedGame.findUnique({
        //   where: { gameId: game.id },
        // });

        if (false) {
          console.log(`Game ${game.id} already evaluated. Skipping.`);
          evaluatedGames.push(existingEvaluatedGame.data);
        } else {
          const evaluatedGame = await evaluateGame(game.id);
          evaluatedGames.push(evaluatedGame);
        }
      }
      
      res.status(200).json(evaluatedGames);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
