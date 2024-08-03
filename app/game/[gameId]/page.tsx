import { EvaluatedGame } from '../../types';

async function getGameDetails(gameId: string) {
  // This function now runs on the server
  const response = await fetch(`/api/v2/mlb/getGameDetails?gameId=${gameId}`, {
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
  let error: string | null = null;

  try {
    game = await getGameDetails(gameId);
  } catch (err) {
    console.error('Error fetching game details:', err);
    error = 'Error loading game details';
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!game) {
    return <div className="text-center text-gray-800">Loading game details...</div>;
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
            {/* ... (keep the existing sidebar content) */}
          </div>
        </div>
      </div>
    </div>
  );
}
