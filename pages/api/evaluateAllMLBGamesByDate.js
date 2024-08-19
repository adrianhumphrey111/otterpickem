import { getScheduleByDate } from '../../utils/mlbScheduleUtils';
import { evaluateGame } from '../api/v2/mlb/getGameById';
import { PrismaClient } from '@prisma/client';
delete require.cache[require.resolve('dotenv')]
require('dotenv').config(); // Make sure to install dotenv and create a .env file with your API key

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Immediately send a 200 response
    res.status(200).json({ message: 'Request received, processing started' });

    // Continue processing asynchronously
    processGames().catch(console.error);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

async function processGames() {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    const date = currentDate.getDate();

    console.log(year, month, date)

    const games = await getScheduleByDate(year, month, date);
    console.log(games)
    
    for (let i = 0; i < games.length; i++) {
      const game = games[i];

      console.log("Evaluating Game")
      
      // Check if the game has already been evaluated
      const existingEvaluatedGame = await prisma.evaluatedGame.findUnique({
        where: { gameId: game.id },
      });

      if (existingEvaluatedGame) {
        console.log(`Game ${game.id} already evaluated. Skipping.`);
      } else {
        await evaluateGame(game.id);
        console.log(`Game ${game.id} evaluated and saved.`);
      }
    }
    
    console.log('All games processed successfully');
  } catch (error) {
    console.error('Error processing games:', error);
  }
}
