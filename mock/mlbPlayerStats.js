// Mock MLB player statistics data

const mlbPlayerStats = [
  {
    playerId: "123456",
    name: "John Doe",
    team: "New York Yankees",
    position: "Pitcher",
    stats: {
      ERA: 3.25,
      wins: 12,
      losses: 6,
      strikeouts: 180,
      innings: 200.1,
      WHIP: 1.10
    }
  },
  {
    playerId: "789012",
    name: "Jane Smith",
    team: "Los Angeles Dodgers",
    position: "Outfielder",
    stats: {
      battingAverage: .305,
      homeRuns: 28,
      RBIs: 95,
      OPS: .912,
      stolenBases: 15
    }
  },
  // Add more mock player data as needed
];

module.exports = mlbPlayerStats;
