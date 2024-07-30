import { makeDelayedApiCall } from './apiUtils';

export async function getScheduleByDate(year, month, date) {
  try {
    // Get the game schedule
    const scheduleData = await makeDelayedApiCall(
      `https://api.sportradar.com/mlb/production/v7/en/games/${year}/${month}/${date}/schedule.json`,
      {},
      0
    );

    return scheduleData.games;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
