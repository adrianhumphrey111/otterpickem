import { Metadata } from 'next'
import { EvaluatedGame } from '@/app/types'
import GameDetailsClient from './GameDetailsClient';

async function getGameDetails(gameId: string): Promise<EvaluatedGame> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiUrl}/api/v2/mlb/getGameDetails?gameId=${gameId}`, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error('Failed to fetch game details');
  }
  return response.json();
}

export async function generateMetadata({ params }: { params: { gameId: string } }): Promise<Metadata> {
  const gameData = await getGameDetails(params.gameId);

  return {
    title: `${gameData.data.awayTeam.name} vs ${gameData.data.homeTeam.name} Prediction - Expert Analysis`,
    description: `Get expert predictions for ${gameData.data.awayTeam.name} vs ${gameData.data.homeTeam.name}. Stats, analysis, and betting tips.`,
    openGraph: {
      title: `${gameData.data.awayTeam.name} vs ${gameData.data.homeTeam.name} Prediction`,
      description: `Expert prediction and analysis for ${gameData.data.awayTeam.name} vs ${gameData.data.homeTeam.name}`,
    },
  }
}

export default async function GameDetails({ params }: { params: { gameId: string } }) {
  const gameData = await getGameDetails(params.gameId);

  return <GameDetailsClient initialGame={gameData} gameId={params.gameId} />;
}