import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Baseball } from 'lucide-react';

const TeamSection = ({ team, isHome }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 bg-gray-50 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h4 className="text-lg font-semibold text-black">{team.name} {isHome ? '(Home)' : '(Away)'}</h4>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isExpanded && (
        <div className="mt-2">
          <p className="text-black"><span className="font-medium">Wins:</span> {team.standings.win}</p>
          <p className="text-black"><span className="font-medium">Losses:</span> {team.standings.loss}</p>
          <div className="mt-2">
            <p className="text-black font-medium">Probable Pitcher:</p>
            <div className="flex items-center mt-1">
              <User size={16} className="mr-2" />
              <p className="text-black">{team.boxScore.probable_pitcher?.full_name || "TBA"}</p>
            </div>
            <div className="flex items-center mt-1">
              <Baseball size={16} className="mr-2" />
              <p className="text-black">ERA: {team.boxScore.probable_pitcher?.era || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function InteractiveGameDetails({ game }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-black">Game Details</h3>
      <TeamSection 
        team={{
          name: game.data.awayTeam.name,
          standings: game.data.awayTeam.standings,
          boxScore: game.data.boxScore.away
        }} 
        isHome={false} 
      />
      <TeamSection 
        team={{
          name: game.data.homeTeam.name,
          standings: game.data.homeTeam.standings,
          boxScore: game.data.boxScore.home
        }} 
        isHome={true} 
      />
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Game Time: {new Date(game.data.boxScore.scheduled).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          Venue: {game.data.boxScore.venue.name}
        </p>
      </div>
    </div>
  );
}