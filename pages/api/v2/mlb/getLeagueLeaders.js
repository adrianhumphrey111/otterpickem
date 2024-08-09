import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

async function fetchLeagueLeaders() {
  const url = 'https://api.sportradar.com/mlb/trial/v7/en/seasons/2024/REG/leaders/statistics.json';
  const response = await axios.get(url, {
    params: { api_key: process.env.SPORTS_RADAR_API_KEY_UPDATED },
    headers: { accept: 'application/json' }
  });
  return response.data;
}

function filterMLBData(data, type, category) {
  const mlbLeague = data.leagues.find(league => league.alias === "MLB");
  if (!mlbLeague) {
    throw new Error("MLB data not found");
  }

  const categoryData = mlbLeague[type];
  if (!categoryData) {
    throw new Error(`${type} data not found`);
  }

  return categoryData[category];
}

export async function getLeagueLeaders(type, category) {
  const cacheKey = `leagueLeaders_${type}_${category}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const data = await fetchLeagueLeaders();
    const filteredData = filterMLBData(data, type, category);
    cache.set(cacheKey, filteredData);
    return filteredData;
  } catch (error) {
    console.error('Error fetching league leaders:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { type, category } = req.query;

    if (!type || !category) {
      return res.status(400).json({ error: 'Both type and category are required' });
    }

    if (!['hitting', 'pitching'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "hitting" or "pitching"' });
    }

    if (!['players', 'teams'].includes(category)) {
      return res.status(400).json({ error: 'Category must be either "players" or "teams"' });
    }

    try {
      const leagueLeaders = await getLeagueLeaders(type, category);
      res.status(200).json(leagueLeaders);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
