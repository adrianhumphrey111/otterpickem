import { EvaluatedGame } from '../../types';

async function getGameDetails(gameId: string) {
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('API base URL is not defined');
  }

  const response = await fetch(`${baseUrl}/api/v2/mlb/getGameDetails?gameId=${gameId}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch game details');
  }
  return response.json();
}

export default async function GameDetails({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId;
  let game: EvaluatedGame;

  try {
    game = await getGameDetails(gameId);
  } catch (error) {
    console.error('Error fetching game details:', error);
    return <div className="text-center text-red-600">Error loading game details</div>;
  }

  if (!game) {
    return <div className="text-center text-gray-800">Game not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-black mb-10">
          Game Details
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                {game.data.awayTeam.name} vs {game.data.homeTeam.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(game.data.boxScore.scheduled).toLocaleString()}
              </p>
              <h3 className="text-xl font-semibold mb-2 text-black">Analysis</h3>
              <p className="text-gray-700 whitespace-pre-line">{game.claudeResponse}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-black">Game Details</h3>
              <p className="mb-2 text-gray-600"><span className="font-semibold">Date:</span> {new Date(game.data.boxScore.scheduled).toLocaleDateString()}</p>
              <p className="mb-2 text-gray-600"><span className="font-semibold">Time:</span> {new Date(game.data.boxScore.scheduled).toLocaleTimeString()}</p>
              <p className="mb-2 text-gray-600"><span className="font-semibold">Venue:</span> {game.data.boxScore.venue?.name || 'TBA'}</p>
              <p className="mb-2 text-gray-600"><span className="font-semibold">Broadcast:</span> {game.data.boxScore.broadcast?.network || 'TBA'}</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-black">Probable Pitchers</h3>
              <p className="mb-2 text-gray-600"><span className="font-semibold">{game.data.awayTeam.name}:</span> {game.data.boxScore.away.probable_pitcher?.full_name || 'TBA'}</p>
              <p className="text-gray-600"><span className="font-semibold">{game.data.homeTeam.name}:</span> {game.data.boxScore.home.probable_pitcher?.full_name || 'TBA'}</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-black">Team Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">{game.data.awayTeam.name}</h4>
                  <p className="text-sm text-gray-600">AVG: {game.data.awayTeam.stats.hitting.overall.avg}</p>
                  <p className="text-sm text-gray-600">OPS: {game.data.awayTeam.stats.hitting.overall.ops}</p>
                  <p className="text-sm text-gray-600">ERA: {game.data.awayTeam.stats.pitching.overall.era}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">{game.data.homeTeam.name}</h4>
                  <p className="text-sm text-gray-600">AVG: {game.data.homeTeam.stats.hitting.overall.avg}</p>
                  <p className="text-sm text-gray-600">OPS: {game.data.homeTeam.stats.hitting.overall.ops}</p>
                  <p className="text-sm text-gray-600">ERA: {game.data.homeTeam.stats.pitching.overall.era}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}