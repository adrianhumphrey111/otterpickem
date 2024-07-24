import { PrismaClient } from '@prisma/client';
import mlbTeams from '../../../mocks/mlbTeams.json';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log(mlbTeams)
    await addTeamsToDB(mlbTeams);
    res.status(200).json({ message: 'Teams added successfully' });
  } catch (error) {
    console.error('Error adding teams:', error);
    res.status(500).json({ message: 'Error adding teams', error: error.message });
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
