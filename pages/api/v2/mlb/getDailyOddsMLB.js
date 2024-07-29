import { makeDelayedApiCall } from '../../../../utils/apiUtils';

export default async function handler(req, res) {
  try {
    const oddsData = await getDailyOddsMLB();
    res.status(200).json(oddsData);
  } catch (error) {
    console.error('Error fetching MLB odds:', error);
    res.status(500).json({ error: 'Failed to fetch MLB odds' });
  }
}

async function getDailyOddsMLB() {
  const url = 'https://api.sportradar.com/oddscomparison-usp/trial/v2/en/sports/sr:sport:3/events/schedule.json';
  const response = await makeDelayedApiCall(url, {}, 1500);

  const mlbEvents = response.sport_events.filter(event => event.tournament.name === "MLB");

  return {
    sport_events: mlbEvents
  };
}
