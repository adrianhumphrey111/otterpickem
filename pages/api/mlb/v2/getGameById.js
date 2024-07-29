import { makeDelayedApiCall } from '../../../../utils/apiUtils';

async function getPlayerProfile(playerId) {
  const url = `https://api.sportradar.com/mlb/trial/v7/en/players/${playerId}/profile.json`;
  return await makeDelayedApiCall(url, {}, 1500);
}

async function evaluateGame(gameId) {
  const boxScoreUrl = `https://api.sportradar.com/mlb/trial/v7/en/games/${gameId}/boxscore.json`;
  const boxScore = await makeDelayedApiCall(boxScoreUrl, {}, 1500);

  const homePitcherId = boxScore.game.home.probable_pitcher?.id;
  const awayPitcherId = boxScore.game.away.probable_pitcher?.id;

  let homePitcherProfile, awayPitcherProfile;

  if (homePitcherId) {
    homePitcherProfile = await getPlayerProfile(homePitcherId);
  }

  if (awayPitcherId) {
    awayPitcherProfile = await getPlayerProfile(awayPitcherId);
  }

  return {
    gameId: boxScore.game.id,
    homeTeam: boxScore.game.home.name,
    awayTeam: boxScore.game.away.name,
    homePitcher: homePitcherProfile ? {
      id: homePitcherProfile.player.id,
      name: `${homePitcherProfile.player.first_name} ${homePitcherProfile.player.last_name}`,
      stats: homePitcherProfile.player.seasons[0]?.totals?.statistics?.pitching?.overall,
      lastStarts: homePitcherProfile.player.seasons[0]?.totals?.statistics?.pitching?.last_starts
    } : null,
    awayPitcher: awayPitcherProfile ? {
      id: awayPitcherProfile.player.id,
      name: `${awayPitcherProfile.player.first_name} ${awayPitcherProfile.player.last_name}`,
      stats: awayPitcherProfile.player.seasons[0]?.totals?.statistics?.pitching?.overall,
      lastStarts: awayPitcherProfile.player.seasons[0]?.totals?.statistics?.pitching?.last_starts
    } : null,
    boxScore: boxScore.game
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
