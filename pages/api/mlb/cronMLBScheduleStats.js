import { PrismaClient } from '@prisma/client';
import { makeApiCall } from '../../../utils/apiUtils';

const prisma = new PrismaClient();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function savePlayerProfileToDB(player) {
  try {
    const seasonsData = player.seasons.filter(season => season.year === 2024 && season.type === "REG");
    await prisma.mLBPlayer.upsert({
      where: { id: player.id },
      update: {
        firstName: player.first_name,
        lastName: player.last_name,
        preferredName: player.preferred_name,
        position: player.primary_position,
        birthcity: player.birthcity,
        birthcountry: player.birthcountry,
        height: player.height,
        weight: player.weight,
        status: player.status,
        primary_position: player.primary_position,
        throwHand: player.throw_hand,
        seasons: player.seasons.filter( season => season.year === 2024 && season.type === "REG"),
        primaryPosition: player.primary_position

      },
      create: {
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        preferredName: player.preferred_name,
        position: player.primary_position,
        birthcity: player.birthcity,
        throwHand: player.throw_hand,
        birthcountry: player.birthcountry,
        height: player.height,
        weight: player.weight,
        status: player.status,
        seasons: {
          create: seasonsData.map(season => ({
            year: season.year,
            type: season.type,
            // Include other fields from your MLBSeason model
            //For example:
            teams: {
              create: season.teams.map(team => ({
                name: team.name,
                market: team.market,
                abbr: team.abbr,
                teamId: team.id
              }))
            },
            statistics: {
              create: {
                seasonId: season.id,
                pitching: {
                  create: {
                    oba: season.totals.statistics.pitching.overall.oba,
                    era: season.totals.statistics.pitching.overall.era,
                    k9: season.totals.statistics.pitching.overall.k9,
                    whip: season.totals.statistics.pitching.overall.whip,
                    kbb: season.totals.statistics.pitching.overall.kbb,
                    ip_1: season.totals.statistics.pitching.overall.ip_1,
                    ip_2: parseInt(season.totals.statistics.pitching.overall.ip_2),
                    bf: season.totals.statistics.pitching.overall.bf,
                    gofo: season.totals.statistics.pitching.overall.gofo,
                    babip: season.totals.statistics.pitching.overall.babip,
                    war: season.totals.statistics.pitching.overall.war,
                    fip: season.totals.statistics.pitching.overall.fip,
                    xfip: season.totals.statistics.pitching.overall.xfip,
                    eraMinus: season.totals.statistics.pitching.overall.era_minus,
                    gbfb: season.totals.statistics.pitching.overall.gbfb,
                  }
                }
              }
            }
          }))
        },
        
        primaryPosition: player.primary_position
        // Add more fields as needed
      },
    });
  } catch (error) {
    console.error('Error saving player profile to database:', error);
  }
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

const extractPitchingStats = (player) => {
  const pitchingStats = player.seasons[0].totals.statistics.pitching.overall;
  const prioritizedStats = {
    ERA: pitchingStats.era,
    WHIP: pitchingStats.whip,
    FIP: pitchingStats.fip || null, // Assuming FIP is not provided in this data
    K9: pitchingStats.k9,
    BB9: pitchingStats.bb9 || null, // Assuming BB/9 is not provided in this data
    HR9: pitchingStats.onbase.hr9,
    xFIP: pitchingStats.xfip || null, // Assuming xFIP is not provided in this data
    SwStr: pitchingStats.swstr || null, // Assuming Swinging Strike Rate is not provided in this data
    GBFB: pitchingStats.gbfb,
    Velocity: pitchingStats.velocity || null // Assuming Pitch Velocity is not provided in this data
  };
  return prioritizedStats;
};

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
        // await saveGameToDatabase(game);
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

        let homeProbablePitcherData;
        let awayPrabablePitcherData;

        // Get the player profiles for both starting pitchers and save to DB
        if(homePitcherId){
            homeProbablePitcherData = await makeApiCall(
                `https://api.sportradar.com/mlb/production/v7/en/players/${homePitcherId}/profile.json`,
                {},
                cumulativeDelay
              );
              cumulativeDelay += delayIncrement;
            //await savePlayerProfileToDB(homeProbablePitcherData.player);
            homeProbablePitcherData.extractedStats = extractPitchingStats(homeProbablePitcherData.player)
        }
        
        if(awayPitcherId){
            awayPrabablePitcherData = await makeApiCall(
                `https://api.sportradar.com/mlb/production/v7/en/players/${awayPitcherId}/profile.json`,
                {},
                cumulativeDelay
              );
              cumulativeDelay += delayIncrement;
           // await savePlayerProfileToDB(awayPrabablePitcherData.player);
           awayPrabablePitcherData.extractPitchingStats = extractPitchingStats(awayPrabablePitcherData.player)
        }

        gameData.push({
          gameId: game.id,
          homeTeam: boxScore.home.name,
          awayTeam: boxScore.away.name,
          homePitcher: homeProbablePitcherData.extractPitchingStats,
          awayPitcher: awayPrabablePitcherData.extractPitchingStats
        });
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
