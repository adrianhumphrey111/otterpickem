import { makeDelayedApiCall } from '../../../../utils/apiUtils';

async function fetchGameOdds(gameId) {
  const url = `https://api.sportradar.com/oddscomparison-usp/trial/v2/en/sports/sr:sport:3/events/sr:match:${gameId}/markets.json`;
  return await makeDelayedApiCall(url, {}, 1500);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { gameId } = req.query;
  
  if (!gameId || typeof gameId !== 'string') {
    return res.status(400).json({ error: 'Valid Game ID is required' });
  }

  try {
    const oddsData = await fetchGameOdds(gameId);
    
    if (!oddsData || !oddsData.markets) {
      return res.status(404).json({ error: 'No odds data found for the given game ID' });
    }

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
    res.status(error.response?.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
}
