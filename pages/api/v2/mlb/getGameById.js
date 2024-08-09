import { makeDelayedApiCall } from '../../../../utils/apiUtils';
import { getCurrentRunDifferentials } from './getCurrentRunDifferentials';
import { getTeamStatistics } from './getTeamStatistics';
import { getCurrentOPS } from './getCurrentOPS';
import { getRecentTeamGames, getHeadToHeadGames } from './getRecentTeamGames';
import { getTeamStandings } from './getTeamStandings';
import { getOpenAIResponse } from '../../../../utils/openaiUtils';
import { mockedEvaluatedGame } from '../../../../utils/mockData.js';
import { getDailyOddsMLB } from './getDailyOddsMLB.js';
import { PrismaClient } from '@prisma/client';
import axios from "axios"
import { getOpenAIResponse } from '../../../../utils/openaiUtils.js';

const prisma = new PrismaClient();

let lastApiCallTime = 0;

async function makeApiCallWithDelay(apiCallFunction, ...args) {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;
  if (timeSinceLastCall < 200) {
    await new Promise(resolve => setTimeout(resolve, 200 - timeSinceLastCall));
  }

  console.log(apiCallFunction)

  const result = await apiCallFunction(...args);
  lastApiCallTime = Date.now();
  return result;
}

export async function saveGameToDB(evaluatedGame, claudeResponse) {
  try {
    const savedGame = await prisma.evaluatedGame.upsert({
      where: { gameId: evaluatedGame.gameId },
      update: {
        data: evaluatedGame,
        claudeResponse: claudeResponse,
      },
      create: {
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

async function makeApiCallByUrl(url, params = {}){
  try{
    const response = await axios.get(url, {
      params: { ...params, api_key: process.env.SPORTS_RADAR_API_KEY_UPDATED },
      headers: { accept: 'application/json' }
    });
    return response.data;
  }catch(error){
    console.log(error.request)
  }
}

function getFormattedDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Ensure two digits
  const date = String(currentDate.getDate()).padStart(2, '0'); // Ensure two digits

  return `${year}-${month}-${date}`;
}

// Usage example:
const formattedDate = getFormattedDate();
console.log(formattedDate); // Outputs: "YYYY-MM-DD"


async function getPlayerProfile(playerId) {
  const response = await makeApiCallByUrl(`https://api.sportradar.com/mlb/trial/v7/en/players/${playerId}/profile.json`)
  return response.player
}

async function getBoxScore(gameId){
  const boxScoreUrl = `https://api.sportradar.com/mlb/trial/v7/en/games/${gameId}/boxscore.json`;
  const response = await makeApiCallByUrl(boxScoreUrl)
  return response
}

export async function evaluateGame(gameId) {
  const startTime = Date.now();

  const boxScore = await makeApiCallWithDelay(getBoxScore, gameId);

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
  //const teamOPS = await makeApiCallWithDelay(getCurrentOPS);
  const teamBattingLeaders = await makeApiCallWithDelay(getTeamStatistics)

  // Get recent games for both teams
  const homeRecentGames = await makeApiCallWithDelay(getRecentTeamGames, boxScore.game.home.id, boxScore.game.scheduled);
  const awayRecentGames = await makeApiCallWithDelay(getRecentTeamGames, boxScore.game.away.id, boxScore.game.scheduled);
  const headToHeadGames = await makeApiCallWithDelay(getHeadToHeadGames, boxScore.game.away.id, boxScore.game.home.id);

  // Get team standings
  const {homeTeamStandings, awayTeamStandings} = await makeApiCallWithDelay(getTeamStandings, boxScore.game.home.id, boxScore.game.away.id);

  const oddsByMarket = await makeApiCallWithDelay(getDailyOddsMLB, getFormattedDate(), boxScore.game.home.abbr)

  const gameData = {
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
      id: homePitcherProfile.id,
      name: `${homePitcherProfile.first_name} ${homePitcherProfile.last_name}`,
      stats: homePitcherProfile.seasons[0]?.totals?.statistics?.pitching?.overall,
      splits: homePitcherProfile.seasons[0]?.totals?.splits?.pitching?.overall
    } : null,
    awayPitcher: awayPitcherProfile ? {
      id: awayPitcherProfile.id,
      name: `${awayPitcherProfile.first_name} ${awayPitcherProfile.last_name}`,
      stats: awayPitcherProfile.seasons[0]?.totals?.statistics?.pitching?.overall,
      splits: awayPitcherProfile.seasons[0]?.totals?.splits?.pitching?.overall
    } : null,
    boxScore: boxScore.game,
    runDifferentials: runDifferentials,
    battingleadersByTeam: teamBattingLeaders,
    oddsByMarket: oddsByMarket
  };

  // Get Claude's response
  let claudeResponse;
  try {
    // We want to reset the tokens per minute, so wait a minute and a half
    claudeResponse = await getOpenAIResponse(gameData)
    //claudeResponse = await getClaudeResponse(gameData);
  } catch (claudeError) {
    // Log and output only the error message
    if (error.response) {
      // Server responded with a status code out of the range of 2xx
      console.error('Error message:', error.message);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      // No response was received after the request was made
      console.error('Error message:', error.message);
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
  }

  // Add Claude's response to the evaluatedGame object
  gameData.claudeResponse = claudeResponse;

  // Save the evaluatedGame data to the database
  try {
    const savedGame = await saveGameToDB(gameData, claudeResponse);
    console.log(`Game ${gameId} saved to database successfully with ID: ${savedGame.id}`);
  } catch (dbError) {
    console.error('Error saving game to database:', dbError);
    // Note: We're not returning here, so the API will still return the evaluatedGame data even if DB save fails
  }

  lastApiCallTime = 0;
  
  const endTime = Date.now();
  const executionTimeInSeconds = (endTime - startTime) / 1000;
  console.log(`evaluateGame execution time: ${executionTimeInSeconds.toFixed(2)} seconds`);

  return gameData;
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
