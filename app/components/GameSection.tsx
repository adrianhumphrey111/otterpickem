'use client';

import { useState, useEffect } from "react";
import GamesList from "./GameList";
import { Game } from "../types";

export default function GameSection() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/mlb/getTodaysCompletedGameAnalysis');
        const data = await response.json();
        console.log('Fetched games:', data); // Add this line for debugging
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }

    fetchGames();
  }, []);

  const gameOfTheDay = games.find( game => game.gameOfTheDay)
  console.log({games})

  return (
    <>
      {gameOfTheDay && <section id="free-pick" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">{`Today's Free Pick`}</h2>
        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-400">
          <h3 className="text-xl font-semibold text-blue-600">{`${gameOfTheDay.awayTeam.name} @ ${gameOfTheDay.homeTeam.name}`}</h3>
          <p className="text-gray-600">{`Start Time: ${gameOfTheDay.time}`}</p>
          <p className="text-gray-600">{`Pitchers: ${gameOfTheDay.awayStartingPitcher.name} vs ${gameOfTheDay.homeStartingPitcher.name}`}</p>
          <div className="mt-4 bg-blue-100 p-4 rounded-md">
            <p className="font-semibold">Moneyline: Baltimore (-120)</p>
            <p className="font-semibold">Over/Under: Over 8.5 (-110)</p>
          </div>
        </div>
      </section>}

      <section id="all-games" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">All Games</h2>
        <GamesList games={games} />
      </section>
    </>
    
  );
}