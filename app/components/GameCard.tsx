import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '../types';

interface GameCardProps {
  gameData: {
    game: Game;
    awayTeamName: string;
    homeTeamName: string;
  } | null;
}

const GameCard: React.FC<GameCardProps> = ({ gameData }) => {
  if (!gameData) return null;
  
  const { game, awayTeamName, homeTeamName } = gameData;
  return (
    <article className="w-full max-w-sm mx-auto mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-3 gap-2 items-center mb-2">
        <div className="flex flex-col items-center">
          <Image src={game.awayTeam.logoUrl} alt={`${awayTeamName} logo`} width={40} height={40} className="mb-1" />
          <h2 className="text-sm font-bold text-gray-900 text-center truncate w-full">{awayTeamName}</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg font-bold">@</span>
          <span className="text-xs text-gray-500">{game.time}</span>
        </div>
        <div className="flex flex-col items-center">
          <Image src={game.homeTeam.logoUrl} alt={`${homeTeamName} logo`} width={40} height={40} className="mb-1" />
          <h2 className="text-sm font-bold text-gray-900 text-center truncate w-full">{homeTeamName}</h2>
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center mb-2">
        {game.awayStartingPitcher.name} vs {game.homeStartingPitcher.name}
      </div>
      <p className="text-xs text-gray-700 mb-3 h-16 overflow-hidden">
        {`Game preview and analysis would go here. This is where you'd provide a brief overview of the matchup, key players to watch, and any other relevant information.`}
      </p>
      <div className="text-center">
        <Link href="/signup" className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-green-700 transition-colors">
          View Premium Pick
        </Link>
      </div>
    </article>
  );
};

export default GameCard;
