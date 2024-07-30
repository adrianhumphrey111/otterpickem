import { PrismaClient } from '@prisma/client';
import { makeDelayedApiCall } from '../../../../utils/apiUtils';

const prisma = new PrismaClient();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { year, month, date } = req.body;
  
        // Get the game schedule
        const scheduleData = await makeDelayedApiCall(
          `https://api.sportradar.com/mlb/production/v7/en/games/${year}/${month}/${date}/schedule.json`,
          {},
          0
        );

        res.status(200).json(scheduleData.games)

        }catch(e){
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}