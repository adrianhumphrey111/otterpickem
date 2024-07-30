import { makeDelayedApiCall } from '../../../../utils/apiUtils';
import { getCurrentRunDifferentials } from './getCurrentRunDifferentials';
import { getTeamStatistics } from './getTeamStatistics';
import { getCurrentOPS } from './getCurrentOPS';
import { getRecentTeamGames, getHeadToHeadGames } from './getRecentTeamGames';
import { getTeamStandings } from './getTeamStandings';
import { getClaudeResponse } from '../../../../utils/claudeUtils';
import { mockedEvaluatedGame } from '../../../../utils/mockData.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let lastApiCallTime = 0;

async function makeApiCallWithDelay(apiCallFunction, ...args) {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;
  if (timeSinceLastCall < 1500) {
    await new Promise(resolve => setTimeout(resolve, 1500 - timeSinceLastCall));
  }
  const result = await apiCallFunction(...args);
  lastApiCallTime = Date.now();
  return result;
}

export async function saveGameToDB(evaluatedGame, claudeResponse) {
  try {
    const savedGame = await prisma.evaluatedGame.create({
      data: {
        gameId: evaluatedGame.gameId,
        data: evaluatedGame,
        claudeResponse: claudeResponse,
      },
    });
    return savedGame;
  } catch (error) {
    console.error('Error saving game to database:', error);
    throw error;
  }
}


async function getPlayerProfile(playerId) {
  const url = `https://api.sportradar.com/mlb/trial/v7/en/players/${playerId}/profile.json`;
  return await makeApiCallWithDelay(makeDelayedApiCall, url, {}, 0);
}

async function evaluateGame(gameId) {
  const boxScoreUrl = `https://api.sportradar.com/mlb/trial/v7/en/games/${gameId}/boxscore.json`;
  const boxScore = await makeApiCallWithDelay(makeDelayedApiCall, boxScoreUrl, {}, 0);

  const homePitcherId = boxScore.game.home.probable_pitcher?.id;
  const awayPitcherId = boxScore.game.away.probable_pitcher?.id;

  let homePitcherProfile, awayPitcherProfile;

  if (homePitcherId) {
    homePitcherProfile = await makeApiCallWithDelay(getPlayerProfile, homePitcherId);
  }

  if (awayPitcherId) {
    awayPitcherProfile = await makeApiCallWithDelay(getPlayerProfile, awayPitcherId);
  }

  // Get run differentials
  const runDifferentials = await makeApiCallWithDelay(getCurrentRunDifferentials);

  // Get team statistics
  const homeTeamStats = await makeApiCallWithDelay(getTeamStatistics, boxScore.game.home.id);
  const awayTeamStats = await makeApiCallWithDelay(getTeamStatistics, boxScore.game.away.id);

  // Get team OPS
  const teamOPS = await makeApiCallWithDelay(getCurrentOPS);

  // Get recent games for both teams
  const homeRecentGames = await makeApiCallWithDelay(getRecentTeamGames, boxScore.game.home.id, boxScore.game.scheduled);
  const awayRecentGames = await makeApiCallWithDelay(getRecentTeamGames, boxScore.game.away.id, boxScore.game.scheduled);
  const headToHeadGames = await makeApiCallWithDelay(getHeadToHeadGames, boxScore.game.away.id, boxScore.game.home.id);

  // Get team standings
  const {homeTeamStandings, awayTeamStandings} = await makeApiCallWithDelay(getTeamStandings, boxScore.game.home.id, boxScore.game.away.id);

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
