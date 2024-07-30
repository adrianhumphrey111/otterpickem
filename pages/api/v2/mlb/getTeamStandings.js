import { makeDelayedApiCall } from '../../../../utils/apiUtils';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const url = 'https://api.sportradar.com/mlb/trial/v7/en/seasons/2024/REG/standings.json';
      const standings = await makeDelayedApiCall(url, {}, 1500);
      
      res.status(200).json(standings);
    } catch (error) {
      console.error('Error fetching team standings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
