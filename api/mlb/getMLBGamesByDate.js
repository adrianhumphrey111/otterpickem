import { getAllGames } from '../../mlbServices/getMLBScheduleByDate';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
      }

      const games = await getAllGames(date);
      res.status(200).json(games);
    } catch (error) {
      console.error('Error in getMLBGamesByDate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
