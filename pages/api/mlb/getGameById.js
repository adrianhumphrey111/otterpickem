import { makeDelayedApiCall } from '../../../utils/apiUtils';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { gameId } = req.query;

      if (!gameId) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const url = `https://api.sportradar.com/mlb/trial/v7/en/games/${gameId}/boxscore.json`;
      const data = await makeDelayedApiCall(url, {}, 1500);

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching game data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
