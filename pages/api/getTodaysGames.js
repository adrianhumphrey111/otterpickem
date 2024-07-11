import { getMLBSchedule } from "../../utils/getMlbGames";

export default async function handler(req, res) {
  try {
    const stats = await getMLBSchedule();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching MLB stats:', error);
    res.status(500).json({ error: 'Failed to fetch MLB schedule' });
  }
}