import { makeDelayedApiCall } from '../../../../utils/apiUtils';

async function fetchGameOdds(gameId) {
  const url = `https://api.sportradar.com/oddscomparison-usp/trial/v2/en/sports/sr:sport:3/events/sr:match:${gameId}/markets.json`;
  return await makeDelayedApiCall(url, {}, 1500);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { gameId } = req.query;
      
      if (!gameId) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const oddsData = await fetchGameOdds(gameId);
      
      // Process and format the odds data as needed
      const formattedOdds = {
        gameId: gameId,
        markets: oddsData.markets.map(market => ({
          name: market.name,
          books: market.books.map(book => ({
            name: book.name,
            outcomes: book.outcomes.map(outcome => ({
              name: outcome.name,
              odds: outcome.odds
            }))
          }))
        }))
      };

      res.status(200).json(formattedOdds);
    } catch (error) {
      console.error('Error fetching game odds:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
