import { makeDelayedApiCall } from '../../../../utils/apiUtils';

function reduceGameData(fullGameData) {
  const { game } = fullGameData;

  return {
    gameId: game.id,
    date: game.scheduled.split('T')[0],
    homeTeam: {
      id: game.home.id,
      name: `${game.home.market} ${game.home.name}`,
      runsScored: game.home.runs
    },
    awayTeam: {
      id: game.away.id,
      name: `${game.away.market} ${game.away.name}`,
      runsScored: game.away.runs
    },
    result: {
      winner: game.home.runs > game.away.runs ? `${game.home.market} ${game.home.name}` : `${game.away.market} ${game.away.name}`,
      score: {
        homeTeam: game.home.runs,
        awayTeam: game.away.runs
      }
    },
  };
}

async function getRecentTeamGames(teamId, date) {
  const url = 'https://api.sportradar.com/mlb/trial/v7/en/games/2024/REG/schedule.json';
  const scheduleData = await makeDelayedApiCall(url, {}, 1500);

  const filteredGames = scheduleData.games
    .filter(game => 
      (game.home.id === teamId || game.away.id === teamId) &&
      game.status === 'closed' &&
      new Date(game.scheduled) <= new Date(date)
    )
    .sort((a, b) => new Date(b.scheduled) - new Date(a.scheduled))
    .slice(0, 10);

  const detailedGames = await Promise.all(filteredGames.map(async (game) => {
    const gameDetails = await evaluateGame(game.id);
    return {
      ...game,
      details: gameDetails
    };
  }));

  return detailedGames;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { teamId, date } = req.query;
      
      if (!teamId || !date) {
        return res.status(400).json({ error: 'Team ID and date are required' });
      }

      const recentGames = await getRecentTeamGames(teamId, date);
      res.status(200).json(recentGames);
    } catch (error) {
      console.error('Error fetching recent team games:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
