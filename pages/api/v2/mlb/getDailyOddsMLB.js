import { makeDelayedApiCall } from '../../../../utils/apiUtils';

export default async function handler(req, res) {
  try {
    const { date, abbr } = req.query;                                                                            
     if (!date) {                                                                                           
       return res.status(400).json({ error: 'Date parameter is required' });                                
     }                                                                                                      
    const oddsData = await getDailyOddsMLB(date, abbr); 
    res.status(200).json(oddsData);

  } catch (error) {
    console.error('Error fetching MLB odds:', error);
    res.status(500).json({ error: 'Failed to fetch MLB odds' });
  }
}

export async function getDailyOddsMLB(date, abbr) {
  const url = `https://api.sportradar.com/oddscomparison-ust1/en/us/sports/sr%3Asport%3A3/${date}/schedule.json`;
  const response = await makeDelayedApiCall(url, {}, 1500);

  if (!response || !response.sport_events) {
    throw new Error('Invalid response from API');
  }

  const mlbEvents = response.sport_events.filter(event => 
    event.tournament.name === "MLB" && event.status !== "closed"
  );

  if (abbr) {
    // Assuming there could be multiple games that match the abbreviation, use .find() instead of .filter()
    const singleGameOdds = mlbEvents.find(event => 
      event.competitors.some(c => c.abbreviation === abbr)
    );

    // If a matching game is found, return its markets
    if (singleGameOdds && singleGameOdds.markets) {
      return singleGameOdds.markets;
    } else {
      // If no markets are found for the given abbreviation
      return { error: `No markets found for the team abbreviation: ${abbr}` };
    }
  } else {
    return { mlbEvents };
  }
}
