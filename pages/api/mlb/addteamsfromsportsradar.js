import { PrismaClient } from '@prisma/client';
import mlbTeams from '../../../mocks/mlbTeams.json';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log(mlbTeams)
      await addTeamsToDB(mlbTeams);
      res.status(200).json({ message: 'Teams added successfully' });
    } catch (error) {
      console.error('Error adding teams:', error);
      res.status(500).json({ message: 'Error adding teams', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { venues } = req.body;
      if (!venues || !Array.isArray(venues)) {
        return res.status(400).json({ message: 'Invalid request body. Expected {"venues": [...]}' });
      }
      await addVenuesToDB(venues);
      res.status(200).json({ message: 'Venues added successfully' });
    } catch (error) {
      console.error('Error adding venues:', error);
      res.status(500).json({ message: 'Error adding venues', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function addTeamsToDB(teams) {
  for (const team of teams) {
    await prisma.mLBTeam.upsert({
      where: { id: team.id },
      update: {
        name: team.name,
        market: team.market,
        abbr: team.abbr,
      },
      create: {
        id: team.id,
        name: team.name,
        market: team.market,
        abbr: team.abbr
      },
    });
  }
}

async function addVenuesToDB(venues) {
  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { id: venue.id },
      update: {
        name: venue.name,
        city: venue.city,
        state: venue.state,
        country: venue.country,
      },
      create: {
        id: venue.id,
        name: venue.name,
        city: venue.city,
        state: venue.state,
        country: venue.country,
      },
    });
  }
}
