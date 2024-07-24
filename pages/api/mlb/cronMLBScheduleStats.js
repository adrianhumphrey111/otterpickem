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
    // Create or update home team
    await prisma.mLBTeam.upsert({
      where: { id: game.home.id },
      update: {
        name: game.home.name,
        market: game.home.market,
        abbr: game.home.abbr,
      },
      create: {
        id: game.home.id,
        name: game.home.name,
        market: game.home.market,
        abbr: game.home.abbr,
      },
    });

    // Create or update away team
    await prisma.mLBTeam.upsert({
      where: { id: game.away.id },
      update: {
        name: game.away.name,
        market: game.away.market,
        abbr: game.away.abbr,
      },
      create: {
        id: game.away.id,
        name: game.away.name,
        market: game.away.market,
        abbr: game.away.abbr,
      },
    });

    // Create or update venue
    await prisma.mLBVenue.upsert({
      where: { id: game.venue.id },
      update: {
        name: game.venue.name,
        market: game.venue.market,
        capacity: game.venue.capacity,
        surface: game.venue.surface,
        address: game.venue.address,
        city: game.venue.city,
        state: game.venue.state,
        zip: game.venue.zip,
        country: game.venue.country,
      },
      create: {
        id: game.venue.id,
        name: game.venue.name,
        market: game.venue.market,
        capacity: game.venue.capacity,
        surface: game.venue.surface,
        address: game.venue.address,
        city: game.venue.city,
        state: game.venue.state,
        zip: game.venue.zip,
        country: game.venue.country,
      },
    });

    // Create or update game
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

      for (const game of games) {
        // Get the box score for each game
        const boxScoreData = await makeApiCall(
          `https://api.sportradar.com/mlb/production/v7/en/games/${game.id}/boxscore.json`,
          {},
          cumulativeDelay
        );
        cumulativeDelay += delayIncrement;

        const boxScore = boxScoreData.game;

        // Get the starting pitchers' IDs
        const homePitcherId = boxScore.home.probable_pitcher?.id;
        const awayPitcherId = boxScore.away.probable_pitcher?.id;

        let homeProfileData;
        let awayProfileData;

        // Get the player profiles for both starting pitchers and save to DB
        if(homePitcherId){
            homeProfileData = await makeApiCall(
                `https://api.sportradar.com/mlb/production/v7/en/players/${homePitcherId}/profile.json`,
                {},
                cumulativeDelay
              );
              cumulativeDelay += delayIncrement;
            await savePlayerProfileToDB(homeProfileData.player);
        }
        
        if(awayPitcherId){
            awayProfileData = await makeApiCall(
                `https://api.sportradar.com/mlb/production/v7/en/players/${awayPitcherId}/profile.json`,
                {},
                cumulativeDelay
              );
              cumulativeDelay += delayIncrement;
            await savePlayerProfileToDB(awayProfileData.player);
        }

        gameData.push({
          gameId: game.id,
          homeTeam: boxScore.home.name,
          awayTeam: boxScore.away.name,
          homePitcher: homeProfileData?.player,
          awayPitcher: awayProfileData?.player
        });
      }

      async function savePlayerProfileToDB(player) {
        try {
          await prisma.mLBPlayer.upsert({
            where: { id: player.id },
            update: {
              firstName: player.first_name,
              lastName: player.last_name,
              preferredName: player.preferred_name,
              jerseyNumber: player.jersey_number,
              position: player.primary_position,
              birthDate: new Date(player.birth_date),
              birthCity: player.birth_city,
              birthCountry: player.birth_country,
              height: player.height,
              weight: player.weight,
              // Add more fields as needed
            },
            create: {
              id: player.id,
              firstName: player.first_name,
              lastName: player.last_name,
              preferredName: player.preferred_name,
              jerseyNumber: player.jersey_number,
              position: player.primary_position,
              birthDate: new Date(player.birth_date),
              birthCity: player.birth_city,
              birthCountry: player.birth_country,
              height: player.height,
              weight: player.weight,
              // Add more fields as needed
            },
          });
        } catch (error) {
          console.error('Error saving player profile to database:', error);
        }
      }

      res.status(200).json({ games: gameData });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
