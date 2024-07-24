import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function makeApiCall(url, params, delayMs) {
  await delay(delayMs);
  console.log(url, params)
  const response = await axios.get(url, {
    params: { ...params, api_key: process.env.SPORTS_RADAR_API_KEY },
    headers: { accept: 'application/json' }
  });
  return response.data;
}

async function saveGameToDatabase(game) {
  try {
    await prisma.mLBGame.upsert({
      where: { id: game.id },
      update: {
        status: game.status,
        coverage: game.coverage,
        gameNumber: game.game_number,
        dayNight: game.day_night,
        scheduled: new Date(game.scheduled),
        homeTeamId: game.home.id,
        awayTeamId: game.away.id,
        doubleHeader: game.double_header,
        entryMode: game.entry_mode,
        reference: game.reference,
        venueId: game.venue.id,
        broadcastNetwork: game.broadcast?.network
      },
      create: {
        id: game.id,
        status: game.status,
        coverage: game.coverage,
        gameNumber: game.game_number,
        dayNight: game.day_night,
        scheduled: new Date(game.scheduled),
        homeTeamId: game.home.id,
        awayTeamId: game.away.id,
        doubleHeader: game.double_header,
        entryMode: game.entry_mode,
        reference: game.reference,
        venueId: game.venue.id,
        broadcastNetwork: game.broadcast?.network
      },
    });
  } catch (error) {
    console.error('Error saving game to database:', error);
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { year, month, date } = req.body;
      let cumulativeDelay = 0;
      const delayIncrement = 1500; // 1.5 seconds

      // Get the game schedule
      const scheduleData = await makeApiCall(
        `https://api.sportradar.com/mlb/production/v7/en/games/${year}/${month}/${date}/schedule.json`,
        {},
        cumulativeDelay
      );
      cumulativeDelay += delayIncrement;

      const games = scheduleData.games;
      const gameData = [];

      // Save games to database
      for (const game of games) {
        await saveGameToDatabase(game);
      }

      await delay(1500);

    //   for (const game of games) {
    //     // Get the box score for each game
    //     const boxScoreData = await makeApiCall(
    //       `https://api.sportradar.com/mlb/production/v7/en/games/${game.id}/boxscore.json`,
    //       {},
    //       cumulativeDelay
    //     );
    //     cumulativeDelay += delayIncrement;

    //     const boxScore = boxScoreData.game;

    //     // Get the starting pitchers' IDs
    //     const homePitcherId = boxScore.home.probable_pitcher?.id;
    //     const awayPitcherId = boxScore.away.probable_pitcher?.id;

    //     let homeProfileData;
    //     let awayProfileData;

    //     // Get the player profiles for both starting pitchers
    //     if(homePitcherId){
    //         homeProfileData = await makeApiCall(
    //             `https://api.sportradar.com/mlb/production/v7/en/players/${homePitcherId}/profile.json`,
    //             {},
    //             cumulativeDelay
    //           );
    //           cumulativeDelay += delayIncrement;
    //     }
        
    //     if(awayPitcherId){
    //         awayProfileData = await makeApiCall(
    //             `https://api.sportradar.com/mlb/production/v7/en/players/${awayPitcherId}/profile.json`,
    //             {},
    //             cumulativeDelay
    //           );
    //           cumulativeDelay += delayIncrement;
    //     }

    //     gameData.push({
    //       gameId: game.id,
    //       homeTeam: boxScore.home.name,
    //       awayTeam: boxScore.away.name,
    //       homePitcher: homeProfileData,
    //       awayPitcher: awayProfileData
    //     });

    //     continue;
    //   }

      res.status(200).json({ games: gameData });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
