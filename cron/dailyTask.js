import axios from 'axios';
import { getGameById } from '../pages/api/v2/mlb/getGameById.js';

export async function dailyTask() {
  console.log('Running daily task at', new Date().toISOString());

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Fetch today's MLB schedule from Sports Radar API
    const scheduleUrl = `https://api.sportradar.com/mlb/trial/v7/en/games/${today}/schedule.json`;
    const response = await axios.get(scheduleUrl, {
      params: { api_key: process.env.SPORTS_RADAR_API_KEY },
    });

    const games = response.data.games;

    // Process each game
    for (const game of games) {
      await getGameById({ query: { gameId: game.id } }, { status: () => {}, json: () => {} });
    }

    console.log('Daily task completed successfully');
  } catch (error) {
    console.error('Error in daily task:', error);
  }
}
