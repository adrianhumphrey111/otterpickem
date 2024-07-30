import { getScheduleByDate } from '../../utils/mlbScheduleUtils';
import { evaluateGame } from '../../utils/evaluateGame';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
      const date = currentDate.getDate();

      const games = await getScheduleByDate(year, month, date);
      
      res.status(200).json(games);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
