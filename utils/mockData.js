export const mockedEvaluatedGame = [
  {
    gameId: "1234567890",
    homeTeam: {
      name: "New York Yankees",
      stats: {
        wins: 50,
        losses: 30,
        winPercentage: 0.625
      },
      recentGames: [
        { result: "W", score: "5-2" },
        { result: "L", score: "3-4" },
        { result: "W", score: "8-1" }
      ]
    },
    awayTeam: {
      name: "Boston Red Sox",
      stats: {
        wins: 45,
        losses: 35,
        winPercentage: 0.563
      },
      recentGames: [
        { result: "W", score: "6-3" },
        { result: "W", score: "4-2" },
        { result: "L", score: "1-5" }
      ]
    },
    headToHeadGames: [
      { winner: "New York Yankees", score: "6-4" },
      { winner: "Boston Red Sox", score: "3-2" },
      { winner: "New York Yankees", score: "7-5" }
    ],
    homePitcher: {
      id: "P001",
      name: "Gerrit Cole",
      stats: {
        era: 2.95,
        wins: 8,
        losses: 2,
        strikeouts: 120
      }
    },
    awayPitcher: {
      id: "P002",
      name: "Chris Sale",
      stats: {
        era: 3.10,
        wins: 7,
        losses: 3,
        strikeouts: 110
      }
    },
    boxScore: {
      home: { runs: 0, hits: 0, errors: 0 },
      away: { runs: 0, hits: 0, errors: 0 }
    },
    runDifferentials: {
      "New York Yankees": 75,
      "Boston Red Sox": 60
    },
    opsRankings: {
      "New York Yankees": 3,
      "Boston Red Sox": 5
    }
  }
];
