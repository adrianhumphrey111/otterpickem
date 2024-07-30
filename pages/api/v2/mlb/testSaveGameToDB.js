import { saveGameToDB } from '../../../../utils/dbUtils.js';

const mockGame = {
  gameId: 'test-game-id-123',
  data: {
    homeTeam: {
      name: 'Mock Home Team',
      stats: { wins: 50, losses: 30 }
    },
    awayTeam: {
      name: 'Mock Away Team',
      stats: { wins: 45, losses: 35 }
    },
    homePitcher: {
      name: 'John Doe',
      stats: { era: 3.5, strikeouts: 100 }
    },
    awayPitcher: {
      name: 'Jane Smith',
      stats: { era: 3.8, strikeouts: 90 }
    }
  }
};

const mockClaudeResponse = "This is a mock Claude response for the test game.";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const savedGame = await saveGameToDB(mockGame, mockClaudeResponse);
      res.status(200).json({ message: 'Game saved successfully', savedGame });
    } catch (error) {
      console.error('Error saving game to database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
