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

export interface RecentGame {
    id: string
    away: {
        id: string
        abbr: string
        name: string
        market: string
    }
    home: {
        id: string
        abbr: string
        name: string
        market: string
    }
}

export interface TeamStatsDetailed {
    name: string
    recentGame: RecentGame
    standings: {
        win: number
        loss: number
    }
    market: string;
    stats: {
        hitting: {
            overall: {
                avg: string
                ops: number
            }
        }
        pitching: {
            overall: {
                era: number
            }
        }
    }
}

export interface BoxScoreTeamStats {
    name: string,
    win: number,
    loss:number,
    market: string,
    probable_pitcher: {
        era: number,
        win:number,
        loss: number,
        full_name:string,
        first_name:string,
        last_name: string,
    }
}

export interface EvaluatedGame {
    id: string;
    gameId: string;
    data: {
        gameId: string
        awayTeam: TeamStatsDetailed,
        homeTeam: TeamStatsDetailed,
        boxScore: {
            away: BoxScoreTeamStats
            home: BoxScoreTeamStats
            scheduled: string
            venue: {
                name: string
            }
            broadcast: {
                network: string
            }
        }
    }; 
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
