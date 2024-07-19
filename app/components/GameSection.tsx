'use client';

import { useState, useEffect } from "react";
import GamesList from "./GameList";
import GameOfTheDayCard from "./GameOfTheDayCard";
import LoadingCard from "./LoadingCard";
import { Game } from "../types";

export default function GameSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [gameOfTheDay, setGameOfTheDay] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [gamesResponse, gameOfTheDayResponse] = await Promise.all([
          fetch('/api/mlb/getTodaysCompletedGameAnalysis'),
          fetch('/api/mlb/getGameOfTheDay')
        ]);
        const gamesData = await gamesResponse.json();
        const gameOfTheDayData = await gameOfTheDayResponse.json();
        
        setGames(gamesData);
        setGameOfTheDay(gameOfTheDayData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <section id="free-pick" className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{`Today's Free Pick`}</h2>
        {loading ? (
          <LoadingCard />
        ) : gameOfTheDay ? (
          <GameOfTheDayCard game={gameOfTheDay} />
        ) : (
          <p className="text-center text-gray-600">No game of the day available.</p>
        )}
      </section>

      <section id="all-games" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">All Games</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <GamesList games={games} />
        )}
      </section>
    </>
  );
}
