import { getAllGames } from '../../../mlbServices/getMLBScheduleByDate';
import { PrismaClient } from '@prisma/client';
import { mockMLBScheduleData } from '../../../mock/mlbScheduleData'

const USE_MOCK = true;

async function processGameData(gameData, date, sport) {
  const prisma = new PrismaClient();

  try {
    // Get Away team
    const awayTeam = await prisma.team.findFirst({
      where: {
        OR: [
          { name: { contains: gameData.awayTeam.name, mode: 'insensitive' } },
          { name: { contains: gameData.awayTeam.name.split(' ').pop(), mode: 'insensitive' } },
          { abbreviation: { equals: gameData.awayTeam.name, mode: 'insensitive' } }
        ],
        sport: sport
      }
    });

    const homeTeam = await prisma.team.findFirst({
      where: {
        OR: [
          { name: { contains: gameData.homeTeam.name, mode: 'insensitive' } },
          { name: { contains: gameData.homeTeam.name.split(' ').pop(), mode: 'insensitive' } },
          { abbreviation: { equals: gameData.homeTeam.name, mode: 'insensitive' } }
        ],
        sport: sport
      }
    });

    const awayPitcher = await prisma.player.upsert({
      where: { 
        name_teamId: {
          name: gameData.awayTeam.sp.name,
          teamId: awayTeam.id,
        }
      },
      update: {},
      create: {
        name: gameData.awayTeam.sp.name,
        teamId: awayTeam.id,
        fanGraphsPlayerUrl: gameData.awayTeam.sp.url,
        position: 'P',
      },
    })
  
    const homePitcher = await prisma.player.upsert({
      where: { 
        name_teamId: {
          name: gameData.homeTeam.sp.name,
          teamId: homeTeam.id,
        }
      },
      update: {},
      create: {
        name: gameData.homeTeam.sp.name,
        teamId: homeTeam.id,
        fanGraphsPlayerUrl: gameData.homeTeam.sp.url,
        position: 'P',
      },
    })

    // Create game
    const game = await prisma.game.upsert({
      where: {
        homeTeamId_awayTeamId_date: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          date: new Date(date),
        },
      },
      update: {
        time: gameData.time,
        status: 'Scheduled',
        sport: sport,
        homeStartingPitcherId: homePitcher.id,
        awayStartingPitcherId: awayPitcher.id,
        // Add any other fields you want to update if the game already exists
      },
      create: {
        date: new Date(date),
        time: gameData.time,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeStartingPitcherId: homePitcher.id,
        awayStartingPitcherId: awayPitcher.id,
        status: 'Scheduled',
        sport: sport,
        // Add any other fields needed for creating a new game
      },
    });

    console.log(`Game created: ${game.id}`);
    return game;
  } catch (error) {
    console.error('Error processing game data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
      }

      const gamesJson = USE_MOCK ? mockMLBScheduleData.games : await getAllGames(date);
      
      for( let game of gamesJson){
        processGameData(game, date, "MLB")
      }

      res.status(200).json(gamesJson);
    } catch (error) {
      console.error('Error in getMLBGamesByDate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
