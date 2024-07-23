import { PrismaClient } from '@prisma/client';
import { getPitcherStats } from '../../../mlbServices/getMLBScheduleByDate';
import { delay } from '../../../utils/delayUtil';
import axios from 'axios';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Get the daily schedule and map it to the db MLB_GAME
      // TODO: pass in the data
      const options = {
        method: 'GET',
        url: `https://api.sportradar.com/mlb/trial/v7/en/games/2024/03/28/schedule.json?api_key=${process.env.SPORTS_RADAR_API_KEY}`,
        headers: {
          accept: 'application/json'
        }
      };

      const response = await axios.request(options)
      const games = response.data

      const line_up_options = {
        method: 'GET',
        url: `https://api.sportradar.com/mlb/trial/stream/en/probables/subscribe?api_key=${process.env.SPORTS_RADAR_API_KEY}`,
        headers: {
          accept: 'application/json'
        }
      };

      // For each game, get the box score and the staritng pitcher id
      https://api.sportradar.com/mlb/trial/v7/en/games/eb79350c-2095-4921-bec9-16ff17bc1aed/boxscore.json?api_key=VVtSNRbJ2B4yHi83Dbof95ylbxQXZG9i9bFsPwc4'

      // Get the starting pitcher Stats,
      //l 'https://api.sportradar.com/mlb/trial/v7/en/players/12831550-c4ba-463b-9847-6ba08b1eb462/profile.json?api_key=VVtSNRbJ2B4yHi83Dbof95ylbxQXZG9i9bFsPwc4' 
     
      const response1 = await axios.request(line_up_options)
      res.status(200).json(response1.data)
    } else {
      // Handle any other HTTP method
      res.status(403).json({ message: 'Unauthorized!' })
    }
  }
