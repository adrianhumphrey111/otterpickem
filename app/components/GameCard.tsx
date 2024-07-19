import React, { useState } from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  awayTeamName: string;
  homeTeamName: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, awayTeamName, homeTeamName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mr-[25px] border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-600">{awayTeamName} @ {homeTeamName}</h3>
        <button
          onClick={toggleAccordion}
          className="text-blue-500 hover:text-blue-700 focus:outline-none flex items-center"
        >
          <span className="mr-1">Analysis</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>
      <p className="text-gray-600">Start Time: {game.time}</p>
      <p className="text-gray-600">Pitchers: {game.awayStartingPitcher.name} vs {game.homeStartingPitcher.name}</p>
      {isOpen && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-md font-semibold mb-2">Game Analysis</h4>
          <div className="text-sm text-gray-700 space-y-2">
            {game.completeAnalysis.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">
        View Premium Pick
      </button>
    </div>
  );
};

export default GameCard;
