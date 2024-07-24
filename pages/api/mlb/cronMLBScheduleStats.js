import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { year, month, date } = req.body;

      // Get the game schedule
      const scheduleResponse = await axios.get(
        `https://api.sportradar.com/mlb/trial/v7/en/games/${year}/${month}/${date}/schedule.json`,
        {
          params: { api_key: process.env.SPORTS_RADAR_API_KEY },
          headers: { accept: 'application/json' }
        }
      );

      const games = scheduleResponse.data.games;
      const gameData = [];

      for (const game of games) {
        // Get the box score for each game
        const boxScoreResponse = await axios.get(
          `https://api.sportradar.com/mlb/trial/v7/en/games/${game.id}/boxscore.json`,
          {
            params: { api_key: process.env.SPORTS_RADAR_API_KEY },
            headers: { accept: 'application/json' }
          }
        );

        const boxScore = boxScoreResponse.data.game;
        console.log(boxScore)

        // Get the starting pitchers' IDs
        const homePitcherId = boxScore.home.probable_pitcher.id;
        const awayPitcherId = boxScore.away.probable_pitcher.id;

        // Get the player profiles for both starting pitchers
        const [homeProfileResponse, awayProfileResponse] = await Promise.all([
          axios.get(`https://api.sportradar.com/mlb/trial/v7/en/players/${homePitcherId}/profile.json`, {
            params: { api_key: process.env.SPORTS_RADAR_API_KEY },
            headers: { accept: 'application/json' }
          }),
          axios.get(`https://api.sportradar.com/mlb/trial/v7/en/players/${awayPitcherId}/profile.json`, {
            params: { api_key: process.env.SPORTS_RADAR_API_KEY },
            headers: { accept: 'application/json' }
          })
        ]);

        gameData.push({
          gameId: game.id,
          homeTeam: boxScore.home.name,
          awayTeam: boxScore.away.name,
          homePitcher: homeProfileResponse.data,
          awayPitcher: awayProfileResponse.data
        });
      }

      res.status(200).json({ games: gameData });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
