import { getScheduleByDate } from '../../utils/mlbScheduleUtils';
import { evaluateGame } from '../../utils/evaluateGame';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
      const date = currentDate.getDate();

      const games = await getScheduleByDate(year, month, date);
      
      const evaluatedGames = [];
      for (const game of games) {
        const evaluatedGame = await evaluateGame(game.id);
        evaluatedGames.push(evaluatedGame);
        await delay(20000); // 20 second delay between each call
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
