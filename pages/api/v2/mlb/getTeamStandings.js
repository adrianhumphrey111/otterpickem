import { makeDelayedApiCall } from '../../../../utils/apiUtils';

async function getTeamStandings(homeTeamId, awayTeamId) {
  const url = 'https://api.sportradar.com/mlb/trial/v7/en/seasons/2024/REG/standings.json';
  const standings = await makeDelayedApiCall(url, {}, 0);
  const [al, nl] = standings.league.season.leagues;

  const allLeagues = [...al.divisions, ...nl.divisions];
  let allTeams = allLeagues.flatMap(division => division.teams);

  const awayTeamStandings = allTeams.find(t => t.id === awayTeamId) || {};
  const homeTeamStandings = allTeams.find(t => t.id === homeTeamId) || {};

  return { awayTeamStandings, homeTeamStandings };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { homeTeamId, awayTeamId } = req.query;

      if (!homeTeamId || !awayTeamId) {
        return res.status(400).json({ error: 'Both homeTeamId and awayTeamId are required' });
      }

      const teamStandings = await getTeamStandings(homeTeamId, awayTeamId);
      res.status(200).json(teamStandings);
    } catch (error) {
      console.error('Error fetching team standings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
