import { makeDelayedApiCall } from '../../../../utils/apiUtils';
import { getCurrentRunDifferentials } from './getCurrentRunDifferentials';
import { getTeamStatistics } from './getTeamStatistics';

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

  const homeTeamStats = await getTeamStatistics(boxScore.game.home.id);
  const awayTeamStats = await getTeamStatistics(boxScore.game.away.id);

  return {
    gameId: boxScore.game.id,
    homeTeam: {
      name: boxScore.game.home.name,
      stats: homeTeamStats
    },
    awayTeam: {
      name: boxScore.game.away.name,
      stats: awayTeamStats
    },
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
    runDifferentials: runDifferentials
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
