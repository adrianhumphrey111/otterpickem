// import { getMLBSchedule } from "../../utils/getMlbGames.js";
import { mockedEvaluatedGame } from "../../utils/mockData.js";

export default async function handler(req, res) {
  try {
    // Uncomment the line below to use real data instead of mocked data
    // const stats = await getMLBSchedule();
    
    // Using mocked data
    const stats = mockedEvaluatedGame;
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching MLB stats:', error);
    res.status(500).json({ error: 'Failed to fetch MLB schedule' });
  }
}
