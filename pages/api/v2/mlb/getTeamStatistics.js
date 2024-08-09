import { makeDelayedApiCall } from '../../../../utils/apiUtils';

export async function getTeamStatistics(teamId, season = '2024', competition = 'REG') {
  const url = `https://api.sportradar.com/mlb/trial/v7/en/seasons/2024/REG/leaders/statistics.json`;
  const response = await makeDelayedApiCall(url, {}, 0);
  const mlbLeaders = response.leagues.find(l => l.alias === "MLB") || {};
      const {batting_average, runs_scored, doubles, triples, home_runs, runs_batted_in, stolen_bases, hits} = mlbLeaders.hitting || {};
      let truncatedTeamStats = {
        battingAverage: batting_average?.teams.map(t => ({name: t.name, rank: t.rank, avg: t.avg})) || [],
        runsScored: runs_scored?.teams.map(t => ({name: t.name, rank: t.rank, runs: t.runs})) || [],
        doubles: doubles?.teams.map(t => ({name: t.name, rank: t.rank, doubles: t.doubles})) || [],
        triples: triples?.teams.map(t => ({name: t.name, rank: t.rank, triples: t.triples})) || [],
        homeRuns: home_runs?.teams.map(t => ({name: t.name, rank: t.rank, homeRuns: t.hr})) || [],
        runsBattedIn: runs_batted_in?.teams.map(t => ({name: t.name, rank: t.rank, rbis: t.rbi})) || [],
        hits: hits?.teams.map(t => ({name: t.name, rank: t.rank, hits: t.h})) || [],
        stolenBases: stolen_bases?.teams.map(t => ({name: t.name, rank: t.rank, stolenBases: t.sb})) || [],
      }; 
    return truncatedTeamStats
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      
      const teamStats = await getTeamStatistics()
      res.status(200).json(teamStats);
    } catch (error) {
      console.error('Error fetching team statistics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
