import { getGameById } from './getGameByIdFunction';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { gameId } = req.query;
      const data = await getGameById(gameId);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching game data:', error);
      if (error.message === 'Game ID is required') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
