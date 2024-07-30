import { PrismaClient } from '@prisma/client';
import { makeDelayedApiCall } from '../../../../utils/apiUtils';

const prisma = new PrismaClient();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


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

            // Get the game schedule
            const scheduleData = await makeDelayedApiCall(
                `https://api.sportradar.com/mlb/production/v7/en/games/${year}/${month}/${date}/schedule.json`,
                {},
                0
            );

            res.status(200).json(scheduleData.games);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
