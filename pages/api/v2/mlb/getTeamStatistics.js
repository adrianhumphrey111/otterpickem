import { makeDelayedApiCall } from '../../../../utils/apiUtils';

export async function getTeamStatistics(teamId, season = '2024', competition = 'REG') {
  const url = `https://api.sportradar.com/mlb/trial/v7/en/seasons/${season}/${competition}/teams/${teamId}/statistics.json`;
  return await makeDelayedApiCall(url, {}, 1500);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { teamId, season, competition } = req.query;
      
      if (!teamId) {
        return res.status(400).json({ error: 'Team ID is required' });
      }

      const teamStats = await getTeamStatistics(teamId, season, competition);
      res.status(200).json(teamStats.statistics);
    } catch (error) {
      console.error('Error fetching team statistics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
