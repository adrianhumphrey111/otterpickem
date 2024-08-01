export interface Pitcher {
    id: number;
    name: string;
    teamId: number;
    fanGraphsPlayerUrl: string;
    position: string;
}

export interface Team {
    id: number;
    name: string;
    logoUrl: string;
    abbreviation: string;
    fanGraphsTeamUrl: string | null;
    externalId: string;
    sport: string;
}

export interface EvaluatedGame {
    id: string;
    gameId: string;
    data: any; // Using 'any' for Json type, you might want to define a more specific type
    claudeResponse: string;
    gameOfTheDay: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Game {
    id: number;
    moneyLine?: string;
    overUnder?: string;
    completeAnalysis?: string;
    date: string;
    time: string;
    homeTeamId: number;
    awayTeamId: number;
    homeStartingPitcherId: number;
    awayStartingPitcherId: number;
    espnBetHomeOdds: number | null;
    espnBetAwayOdds: number | null;
    gameOfTheDay: boolean
    status: string;
    sport: string;
    awayStartingPitcher: Pitcher;
    homeStartingPitcher: Pitcher;
    homeTeam: Team;
    awayTeam: Team;
}

export interface GamesListProps {
    games: Game[];
}
