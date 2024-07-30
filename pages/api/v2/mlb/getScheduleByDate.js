import { getScheduleByDate } from '../../../../utils/mlbScheduleUtils';

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      let year, month, date;
      if (req.method === 'GET') {
        ({ year, month, date } = req.query);
      } else {
        ({ year, month, date } = req.body);
      }

      if (!year || !month || !date) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }

      const games = await getScheduleByDate(year, month, date);
      res.status(200).json(games);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
