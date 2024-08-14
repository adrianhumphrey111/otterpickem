import { makeDelayedApiCall } from '../../../../utils/apiUtils';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function getHeadToHeadGames(awayTeamId, homeTeamId) {
  const scheduleData = await fetchScheduleData();

  const headToHeadGames = scheduleData.games
    .filter(game => 
      game.status === "closed" &&
      ((game.home.id === homeTeamId && game.away.id === awayTeamId) ||
       (game.home.id === awayTeamId && game.away.id === homeTeamId))
    )
    .sort((a, b) => new Date(b.scheduled) - new Date(a.scheduled))

  const detailedGames = await getDetailedGames(headToHeadGames);

  return detailedGames.length > 0 ? detailedGames : [];
}

async function evaluateGame(gameId, delayMs) {
  const url = `https://api.sportradar.com/mlb/trial/v7/en/games/${gameId}/boxscore.json`;
  const fullGameData = await makeDelayedApiCall(url, {}, delayMs);
  return reduceGameData(fullGameData);
}

function reduceGameData(fullGameData) {
  const { game } = fullGameData;

  return {
    gameId: game.id,
    date: game.scheduled.split('T')[0],
    homeTeam: {
      id: game.home.id,
      name: `${game.home.market} ${game.home.name}`,
      runsScored: game.home.runs,
      hits: game.home.hits,
      errors: game.home.errors
    },
    awayTeam: {
      id: game.away.id,
      name: `${game.away.market} ${game.away.name}`,
      runsScored: game.away.runs,
      hits: game.away.hits,
      errors: game.away.errors
    },
    result: {
      winner: game.home.runs > game.away.runs ? `${game.home.market} ${game.home.name}` : `${game.away.market} ${game.away.name}`,
      score: {
        homeTeam: game.home.runs,
        awayTeam: game.away.runs
      }
    },
    innings: game?.innings?.map(inning => ({
      number: inning.number,
      homeRuns: inning.home.runs,
      awayRuns: inning.away.runs
    }))
  };
}

export async function fetchScheduleData() {
  const cacheKey = 'scheduleData2024REG';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log('Using cached schedule data');
    return cachedData;
  }

  console.log('Fetching fresh schedule data');
  const url = 'https://api.sportradar.com/mlb/trial/v7/en/games/2024/REG/schedule.json';
  const scheduleData = await makeDelayedApiCall(url, {}, 0);
  
  cache.set(cacheKey, scheduleData);
  return scheduleData;
}

async function getDetailedGames(games) {
  const detailedGames = [];
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const delayMs = 1500 * (i + 1);
    const gameDetails = await evaluateGame(game.id, delayMs);
    detailedGames.push({
      id: game.id,
      dayOrNight: game.day_night,
      isDoubleHeader: game.double_header,
      venue: {
        name: game.venue.name,
        market: game.venue.market
      },
      home: game.home,
      away: game.away,
      details: gameDetails
    });
  }
  return detailedGames;
}

export async function getRecentTeamGames(teamId, date) {
  const scheduleData = await fetchScheduleData();

  const filteredGames = scheduleData.games
    .filter(game => 
      (game.home.id === teamId || game.away.id === teamId) &&
      game.status === 'closed' &&
      new Date(game.scheduled) <= new Date(date)
    )
    .sort((a, b) => new Date(b.scheduled) - new Date(a.scheduled))
    .slice(0, 10);

  return await getDetailedGames(filteredGames);
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
