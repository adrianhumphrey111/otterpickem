import { makeDelayedApiCall } from '../../../../utils/apiUtils';
import { getCurrentRunDifferentials } from './getCurrentRunDifferentials';
import { getTeamStatistics } from './getTeamStatistics';
import { getCurrentOPS } from './getCurrentOPS';
import { getRecentTeamGames, getHeadToHeadGames } from './getRecentTeamGames';

async function getPlayerProfile(playerId, delayed) {
  const url = `https://api.sportradar.com/mlb/trial/v7/en/players/${playerId}/profile.json`;
  return await makeDelayedApiCall(url, {}, delayed);
}

async function evaluateGame(gameId) {
  let delayed = 0
  const boxScoreUrl = `https://api.sportradar.com/mlb/trial/v7/en/games/${gameId}/boxscore.json`;
  const boxScore = await makeDelayedApiCall(boxScoreUrl, {}, delayed);

  const homePitcherId = boxScore.game.home.probable_pitcher?.id;
  const awayPitcherId = boxScore.game.away.probable_pitcher?.id;

  let homePitcherProfile, awayPitcherProfile;

  if (homePitcherId) {
    delayed += 1500
    homePitcherProfile = await getPlayerProfile(homePitcherId, delayed);
  }

  if (awayPitcherId) {
    delayed += 1500
    awayPitcherProfile = await getPlayerProfile(awayPitcherId);
  }

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get run differentials
  const runDifferentials = await getCurrentRunDifferentials();

  // Get team statistics
  const homeTeamStats = await getTeamStatistics(boxScore.game.home.id);
  const awayTeamStats = await getTeamStatistics(boxScore.game.away.id);

  // Get team OPS
  const teamOPS = await getCurrentOPS();

  // Get recent games for both teams
  const homeRecentGames = await getRecentTeamGames(boxScore.game.home.id, boxScore.game.scheduled);
  const awayRecentGames = await getRecentTeamGames(boxScore.game.away.id, boxScore.game.scheduled);

  const headToHeadGames = await getHeadToHeadGames(boxScore.game.away.id, boxScore.game.home.id);

  return {
    gameId: boxScore.game.id,
    homeTeam: {
      name: boxScore.game.home.name,
      stats: homeTeamStats.statistics,
      recentGames: homeRecentGames
    },
    awayTeam: {
      name: boxScore.game.away.name,
      stats: awayTeamStats.statistics,
      recentGames: awayRecentGames
    },
    headToHeadGames: headToHeadGames,
    homePitcher: homePitcherProfile ? {
      id: homePitcherProfile.player.id,
      name: `${homePitcherProfile.player.first_name} ${homePitcherProfile.player.last_name}`,
      stats: homePitcherProfile.player.seasons[0]?.totals?.statistics?.pitching?.overall,
      splits: homePitcherProfile.player.seasons[0]?.totals?.splits?.pitching?.overall
    } : null,
    awayPitcher: awayPitcherProfile ? {
      id: awayPitcherProfile.player.id,
      name: `${awayPitcherProfile.player.first_name} ${awayPitcherProfile.player.last_name}`,
      stats: awayPitcherProfile.player.seasons[0]?.totals?.statistics?.pitching?.overall,
      splits: awayPitcherProfile.player.seasons[0]?.totals?.splits?.pitching?.overall
    } : null,
    boxScore: boxScore.game,
    runDifferentials: runDifferentials,
    opsRanings: teamOPS
  };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { gameId } = req.query;
      
      if (!gameId) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const evaluatedGame = await evaluateGame(gameId);
      res.status(200).json(evaluatedGame);
    } catch (error) {
      console.error('Error evaluating game:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
