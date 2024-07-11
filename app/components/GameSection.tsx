'use client';

import { useState, useEffect } from "react";
import GamesList from "./GameList";

export default function GameSection() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/getTodaysGames');
        const data = await response.json();
        console.log('Fetched games:', data); // Add this line
        setGames(data.games);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }

    fetchGames();
  }, []);

  console.log('Games in state:', games); // Add this line

  return (
    <section id="all-games" className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">All Games</h2>
      <GamesList games={games} />
    </section>
  );
}