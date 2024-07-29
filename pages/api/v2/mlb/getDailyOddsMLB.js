import { makeDelayedApiCall } from '../../../../utils/apiUtils';

export default async function handler(req, res) {
  try {
    const { date } = req.query;                                                                            
     if (!date) {                                                                                           
       return res.status(400).json({ error: 'Date parameter is required' });                                
     }                                                                                                      
    const oddsData = await getDailyOddsMLB(date); 
    res.status(200).json(oddsData);

  } catch (error) {
    console.error('Error fetching MLB odds:', error);
    res.status(500).json({ error: 'Failed to fetch MLB odds' });
  }
}

async function getDailyOddsMLB(date) {
  const url = `https://api.sportradar.com/oddscomparison-ust1/en/us/sports/sr:sport:3/${date}/schedule.json`;
  const response = await makeDelayedApiCall(url, {}, 0);

  const mlbEvents = response.sport_events.filter(event => event.tournament.name === "MLB");

  return {
    mlbEvents
  };
}
