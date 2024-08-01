import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EvaluatedGame } from '../../types';

export default function GameDetails() {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState<EvaluatedGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      const response = await fetch(`/api/v2/mlb/getGameDetails?gameId=${gameId}`);
      if (response.ok) {
        const data = await response.json();
        setGame(data);
      } else {
        console.error('Failed to fetch game details');
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Game Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{game.data.awayTeam.name} @ {game.data.homeTeam.name}</h2>
        <p className="text-gray-600 mb-2">Date: {new Date(game.data.boxScore.scheduled).toLocaleString()}</p>
        <p className="text-gray-600 mb-4">Venue: {game.data.boxScore.venue?.name || 'TBA'}</p>
        
        <h3 className="text-xl font-semibold mb-2">Probable Pitchers</h3>
        <p className="mb-1">Away: {game.data.boxScore.away.probable_pitcher?.full_name || 'TBA'}</p>
        <p className="mb-4">Home: {game.data.boxScore.home.probable_pitcher?.full_name || 'TBA'}</p>
        
        <h3 className="text-xl font-semibold mb-2">Analysis</h3>
        <p className="text-gray-700">{game.claudeResponse}</p>
      </div>
    </div>
  );
}
