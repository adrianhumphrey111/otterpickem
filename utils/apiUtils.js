import axios from 'axios';

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function makeDelayedApiCall(url, params, delayMs) {
  await delay(delayMs);
  const response = await axios.get(url, {
    params: { ...params, api_key: process.env.SPORTS_RADAR_API_KEY },
    headers: { accept: 'application/json' }
  });
  return response.data;
}
