import React from 'react';
import Link from 'next/link';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  awayTeamName: string;
  homeTeamName: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, awayTeamName, homeTeamName }) => {
  return (
    <article className="max-w-2xl mx-auto mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{awayTeamName} @ {homeTeamName}</h2>
      <div className="text-gray-500 text-sm mb-4">
        <span>{game.time}</span>
        <span className="mx-2">·</span>
        <span>{game.awayStartingPitcher.name} vs {game.homeStartingPitcher.name}</span>
      </div>
      <p className="text-gray-700 mb-4">
        Game preview and analysis would go here. This is where you'd provide a brief overview of the matchup, key players to watch, and any other relevant information.
      </p>
      <Link href="/signup" className="inline-block px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors">
        View Premium Pick
      </Link>
    </article>
  );
};

export default GameCard;
