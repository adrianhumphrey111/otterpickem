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
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const evaluatedGame = await evaluateGame(game.id);
        evaluatedGames.push(evaluatedGame);
        if (i < games.length - 1) {
          await delay(300000); // 5 minute (300,000 ms) delay between each call, except after the last game
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
