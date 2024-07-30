import { makeDelayedApiCall } from '../../../../utils/apiUtils';
import { getCurrentRunDifferentials } from './getCurrentRunDifferentials';
import { getTeamStatistics } from './getTeamStatistics';
import { getCurrentOPS } from './getCurrentOPS';
import { getRecentTeamGames, getHeadToHeadGames } from './getRecentTeamGames';
import { getTeamStandings } from './getTeamStandings';
import { saveGameToDB } from '../../../../utils/dbUtils';
import { getClaudeResponse } from '../../../../utils/claudeUtils';
import { mockedEvaluatedGame } from '../../../../utils/mockData.js';


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
    awayPitcherProfile = await getPlayerProfile(awayPitcherId, delayed);
  }

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get run differentials
  const runDifferentials = await getCurrentRunDifferentials();

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get team statistics
  const homeTeamStats = await getTeamStatistics(boxScore.game.home.id);

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));
  const awayTeamStats = await getTeamStatistics(boxScore.game.away.id);

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get team OPS
  const teamOPS = await getCurrentOPS();

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get recent games for both teams
  const homeRecentGames = await getRecentTeamGames(boxScore.game.home.id, boxScore.game.scheduled);

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));
  const awayRecentGames = await getRecentTeamGames(boxScore.game.away.id, boxScore.game.scheduled);

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));
  const headToHeadGames = await getHeadToHeadGames(boxScore.game.away.id, boxScore.game.home.id);

  // Add a delay of 1500ms
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get team standings
  const {homeTeamStandings, awayTeamStandings} = await getTeamStandings(boxScore.game.home.id, boxScore.game.away.id);

  return {
    gameId: boxScore.game.id,
    homeTeam: {
      name: boxScore.game.home.name,
      stats: homeTeamStats.statistics,
      recentGames: homeRecentGames,
      standings: homeTeamStandings
    },
    awayTeam: {
      name: boxScore.game.away.name,
      stats: awayTeamStats.statistics,
      recentGames: awayRecentGames,
      standings: awayTeamStandings
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
    opsRanings: teamOPS,
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
      // const evaluatedGame = mockedEvaluatedGame;
      
      // Get Claude's response
      let claudeResponse;
      try {
        claudeResponse = await getClaudeResponse(evaluatedGame);
      } catch (claudeError) {
        console.error('Error getting Claude response:', claudeError);
        claudeResponse = 'Error: Unable to get Claude response';
      }

      // Add Claude's response to the evaluatedGame object
      evaluatedGame.claudeResponse = claudeResponse;
      
      // Save the evaluatedGame data to the database
      try {
        const savedGame = await saveGameToDB(evaluatedGame, claudeResponse);
        console.log(`Game ${gameId} saved to database successfully with ID: ${savedGame.id}`);
      } catch (dbError) {
        console.error('Error saving game to database:', dbError);
        // Note: We're not returning here, so the API will still return the evaluatedGame data even if DB save fails
      }

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
