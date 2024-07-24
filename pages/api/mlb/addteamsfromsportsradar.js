import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const teams = await fetchTeamsFromSportsRadar();
    await addTeamsToDB(teams);
    res.status(200).json({ message: 'Teams added successfully' });
  } catch (error) {
    console.error('Error adding teams:', error);
    res.status(500).json({ message: 'Error adding teams', error: error.message });
  }
}

async function fetchTeamsFromSportsRadar() {
  const url = 'http://api.sportradar.us/mlb/trial/v7/en/league/hierarchy.json';
  const response = await axios.get(url, {
    params: { api_key: process.env.SPORTS_RADAR_API_KEY }
  });
  
  const leagues = response.data.leagues;
  const mlbLeague = leagues.find(league => league.name === 'Major League Baseball');
  
  return mlbLeague.divisions.flatMap(division => 
    division.teams.map(team => ({
      id: parseInt(team.id),
      name: team.name,
      market: team.market,
      abbr: team.abbr,
      sport: 'MLB'
    }))
  );
}

async function addTeamsToDB(teams) {
  for (const team of teams) {
    await prisma.mLBTeam.upsert({
      where: { id: team.id },
      update: team,
      create: team,
    });
  }
}
