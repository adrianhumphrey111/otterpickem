import { getScheduleByDate } from '../../utils/mlbScheduleUtils';
import { evaluateGame } from '../api/v2/mlb/getGameById';

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
