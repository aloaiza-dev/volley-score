
export interface MatchConfig {
  pointsPerSet: number;
  lastSetPoints: number; // Usually 15 for tie-breaker
  setsToWin: number; // Best of 3 means setsToWin = 2
  winByTwo: boolean;
  enableAI: boolean;
  isDarkMode: boolean;
  enableSound: boolean;
  language: 'en' | 'es';
}

export interface TeamState {
  name: string;
  score: number;
  setsWon: number;
  color: string;
}

export interface HistoryEvent {
  team: 'A' | 'B';
  type: 'POINT' | 'SET_WIN' | 'MATCH_WIN';
  setIndex: number;
  scoreSnapshot: { a: number; b: number };
  timestamp: number;
}
