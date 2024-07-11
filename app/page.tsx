import Image from "next/image";

export default function Home() {
  const games = [
    {
      awayTeam: "Chicago",
      homeTeam: "Baltimore",
      time: "LIVE",
      awayPitcher: "Shota Imanaga",
      homePitcher: "Corbin Burnes"
    },
    // ... add other games here
  ];

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">Daily MLB Predictions</h1>
        <nav className="mt-4">
          <a href="#free-pick" className="mx-2 px-3 py-2 rounded hover:bg-blue-500 transition-colors">Free Pick</a>
          <a href="#all-games" className="mx-2 px-3 py-2 rounded hover:bg-blue-500 transition-colors">All Games</a>
          <a href="#subscribe" className="mx-2 px-3 py-2 rounded hover:bg-blue-500 transition-colors">Subscribe</a>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <section id="free-pick" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">Today's Free Pick</h2>
          <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-400">
            <h3 className="text-xl font-semibold text-blue-600">Chicago @ Baltimore</h3>
            <p className="text-gray-600">Start Time: LIVE</p>
            <p className="text-gray-600">Pitchers: Shota Imanaga vs Corbin Burnes</p>
            <div className="mt-4 bg-blue-100 p-4 rounded-md">
              <p className="font-semibold">Moneyline: Baltimore (-120)</p>
              <p className="font-semibold">Over/Under: Over 8.5 (-110)</p>
            </div>
          </div>
        </section>

        <section id="all-games" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">All Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-blue-600">{game.awayTeam} @ {game.homeTeam}</h3>
                <p className="text-gray-600">Start Time: {game.time}</p>
                <p className="text-gray-600">Pitchers: {game.awayPitcher} vs {game.homePitcher}</p>
                <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">
                  View Premium Pick
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="subscribe" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">Get All Premium Picks</h2>
          <p className="text-lg mb-4">Unlock all our expert predictions for just $1 per game!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors">
              $1 per game
            </button>
            <button className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors">
              $10 for all of today's games
            </button>
            <button className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors">
              $100 for a full month
            </button>
            <button className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors">
              $999 for a full year
            </button>
          </div>
        </section>
      </div>

      <footer className="bg-blue-600 text-white p-4 text-center">
        <p>© 2024 MLB Predictions. All rights reserved.</p>
        <p className="mt-2 text-sm">Disclaimer: Please bet responsibly. Past performance does not guarantee future results.</p>
      </footer>
    </main>
  );
}