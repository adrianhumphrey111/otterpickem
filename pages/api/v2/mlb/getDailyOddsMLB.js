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
  const url = `https://api.sportradar.com/oddscomparison-ust1/en/us/sports/sr%3Asport%3A3/${date}/schedule.json`;
  const response = await makeDelayedApiCall(url, {}, 1500);

  if (!response || !response.sport_events) {
    throw new Error('Invalid response from API');
  }

  const dateUTC = new Date(date + 'T00:00:00Z');
  const nextDateUTC = new Date(dateUTC);
  nextDateUTC.setDate(nextDateUTC.getDate() + 1);

  const mlbEvents = response.sport_events.filter(event => {
    const eventDate = new Date(event.scheduled);
    return event.tournament.name === "MLB" && 
           eventDate >= dateUTC && 
           eventDate < nextDateUTC;
  });

  return {
    date,
    mlbEvents
  };
}
