
import React, { useState, useEffect, useRef } from 'react';
import { TeamState, MatchConfig, HistoryEvent } from './types';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { SetupScreen } from './components/SetupScreen';
import { Button } from './components/Button';
import { playPointSound, playSetWinSound, playMatchWinSound } from './services/soundService';
import { t } from './utils/translations';

// Icons
const CogIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UndoIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
const RefreshIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const ChartIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ShareIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

export default function App() {
  // Config State
  const [config, setConfig] = useState<MatchConfig>({
    pointsPerSet: 25,
    lastSetPoints: 15,
    setsToWin: 2, // Best of 3
    winByTwo: true,
    isDarkMode: true,
    enableSound: true,
    language: 'en',
  });

  // Apply Theme
  useEffect(() => {
    if (config.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.isDarkMode]);

  // App Flow State
  const [isMatchStarted, setIsMatchStarted] = useState(false);

  // Game State
  const [teamA, setTeamA] = useState<TeamState>({ name: 'Home', score: 0, setsWon: 0, color: 'bg-blue-600' });
  const [teamB, setTeamB] = useState<TeamState>({ name: 'Guest', score: 0, setsWon: 0, color: 'bg-red-600' });
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [matchWinner, setMatchWinner] = useState<string | null>(null);

  // Timer State
  const [matchDuration, setMatchDuration] = useState(0); // seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Refs for sound effects or focus (optional)
  const lastActionTime = useRef(0);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setMatchDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Format Timer
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
       return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const handleStartMatch = () => {
    setIsMatchStarted(true);
    setMatchDuration(0);
    setHistory([]);
    setMatchWinner(null);
    setTeamA(prev => ({ ...prev, score: 0, setsWon: 0 }));
    setTeamB(prev => ({ ...prev, score: 0, setsWon: 0 }));
    // Timer doesn't start until first point
  };

  const checkSetWin = (currentScore: number, opponentScore: number, setIndex: number) => {
    const pointsNeeded = setIndex === (config.setsToWin * 2 - 2) ? config.lastSetPoints : config.pointsPerSet;
    
    if (currentScore >= pointsNeeded) {
      if (!config.winByTwo || (currentScore - opponentScore >= 2)) {
        return true;
      }
    }
    return false;
  };

  const handlePoint = (team: 'A' | 'B') => {
    // Start timer on first point if not running
    if (!isTimerRunning && matchWinner === null) {
      handleStartTimer();
    }

    if (matchWinner) return;

    // Snapshot for history
    const snapshot: HistoryEvent = {
      team,
      type: 'POINT',
      setIndex: teamA.setsWon + teamB.setsWon,
      scoreSnapshot: { a: teamA.score, b: teamB.score },
      timestamp: Date.now()
    };

    let newScoreA = teamA.score;
    let newScoreB = teamB.score;
    let setsWonA = teamA.setsWon;
    let setsWonB = teamB.setsWon;
    let matchOver = false;

    if (team === 'A') {
      newScoreA++;
      setTeamA(prev => ({ ...prev, score: newScoreA }));
    } else {
      newScoreB++;
      setTeamB(prev => ({ ...prev, score: newScoreB }));
    }

    // Check Set Win
    const setIndex = setsWonA + setsWonB;
    if (checkSetWin(team === 'A' ? newScoreA : newScoreB, team === 'A' ? newScoreB : newScoreA, setIndex)) {
      if (config.enableSound) playSetWinSound();
      
      if (team === 'A') setsWonA++;
      else setsWonB++;

      snapshot.type = 'SET_WIN';
      
      setTeamA(prev => ({ ...prev, setsWon: setsWonA, score: 0 }));
      setTeamB(prev => ({ ...prev, setsWon: setsWonB, score: 0 }));
      
      // Pause timer between sets
      handleStopTimer();

      // Check Match Win
      if (setsWonA === config.setsToWin || setsWonB === config.setsToWin) {
        matchOver = true;
        setMatchWinner(setsWonA > setsWonB ? teamA.name : teamB.name);
        snapshot.type = 'MATCH_WIN';
        if (config.enableSound) playMatchWinSound();
        handleStopTimer();
      }
    } else {
      if (config.enableSound) playPointSound();
    }

    setHistory(prev => [...prev, snapshot]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastEvent = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    // Restore scores
    setTeamA(prev => ({ ...prev, score: lastEvent.scoreSnapshot.a }));
    setTeamB(prev => ({ ...prev, score: lastEvent.scoreSnapshot.b }));

    // If it was a set win, we need to revert the set count
    if (lastEvent.type === 'SET_WIN' || lastEvent.type === 'MATCH_WIN') {
       const prevHistory = history.slice(0, -1);
       const setsA = prevHistory.filter(h => h.type === 'SET_WIN' && h.team === 'A').length;
       const setsB = prevHistory.filter(h => h.type === 'SET_WIN' && h.team === 'B').length;
       
       setTeamA(prev => ({ ...prev, setsWon: setsA }));
       setTeamB(prev => ({ ...prev, setsWon: setsB }));
       setMatchWinner(null);
       // Reset match over if it was match win
       // Let user manually resume or resume on next point.
    }

    // If we undo the very first point, reset the timer
    if (history.length === 1) {
       setMatchDuration(0);
       setIsTimerRunning(false);
    }
  };

  const handleReset = () => {
    if (window.confirm(t(config.language, 'resetConfirm'))) {
      setIsMatchStarted(false);
      setIsTimerRunning(false);
    }
  };

  const handleShare = async () => {
    const text = `${t(config.language, 'matchUpdate')}: ${teamA.name} ${teamA.setsWon}-${teamB.setsWon} ${teamB.name} (${t(config.language, 'set')} ${teamA.setsWon + teamB.setsWon + 1}: ${teamA.score}-${teamB.score})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VolleyScore Pro',
          text: text,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert(t(config.language, 'copied'));
    }
  };

  const renameTeam = (team: 'A' | 'B') => {
    const currentName = team === 'A' ? teamA.name : teamB.name;
    const newName = prompt(t(config.language, 'enterTeamName'), currentName);
    if (newName && newName.trim()) {
      if (team === 'A') setTeamA(prev => ({...prev, name: newName.trim()}));
      else setTeamB(prev => ({...prev, name: newName.trim()}));
    }
  };

  if (!isMatchStarted) {
    return (
      <SetupScreen 
        config={config} 
        onUpdateConfig={setConfig} 
        teamA={teamA} 
        setTeamA={setTeamA} 
        teamB={teamB} 
        setTeamB={setTeamB} 
        onStartMatch={handleStartMatch} 
      />
    );
  }

  const currentSet = teamA.setsWon + teamB.setsWon + 1;

  return (
    <div className="flex flex-col h-full overflow-hidden relative select-none">
      
      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={config} 
        onUpdateConfig={setConfig}
        teamA={teamA}
        setTeamA={setTeamA}
        teamB={teamB}
        setTeamB={setTeamB}
      />
      <StatsModal 
        isOpen={isStatsOpen} 
        onClose={() => setIsStatsOpen(false)} 
        teamA={teamA} 
        teamB={teamB} 
        history={history}
        config={config}
      />

      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-800 shadow-sm px-4 py-2 flex items-center justify-between shrink-0 h-16 z-10 transition-colors duration-300">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)}>
             <CogIcon />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => setIsStatsOpen(true)}>
             <ChartIcon />
           </Button>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer" 
          onClick={handleToggleTimer}
          title={isTimerRunning ? t(config.language, 'timerRunning') : t(config.language, 'timerPaused')}
        >
          <div className="text-xl font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></span>
             {formatTime(matchDuration)}
          </div>
          <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            {t(config.language, 'setLabel')} {currentSet}
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={handleShare}>
             <ShareIcon />
           </Button>
           <Button variant="ghost" size="sm" onClick={handleReset}>
             <RefreshIcon />
           </Button>
        </div>
      </div>

      {/* Main Scoreboard Area */}
      <div className="flex-1 flex flex-col landscape:flex-row relative">
        
        {/* Undo Button (Absolute Center/Bottom) */}
        {history.length > 0 && !matchWinner && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
             <button 
               onClick={handleUndo}
               className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full p-4 shadow-xl border border-slate-200 dark:border-slate-600 pointer-events-auto active:scale-95 transition-all"
               aria-label={t(config.language, 'undo')}
             >
               <UndoIcon />
             </button>
          </div>
        )}

        {/* Team A */}
        <div className="flex-1 relative flex flex-col landscape:flex-col items-center justify-center p-4 border-b-8 landscape:border-b-0 landscape:border-r-8 border-slate-100 dark:border-slate-800 transition-colors duration-300">
           <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundColor: teamA.color.replace('bg-', '') }}></div>
           
           <div className="z-10 flex flex-col items-center w-full h-full justify-center">
             <div className="flex items-center gap-2 mb-4 group cursor-pointer" onClick={() => renameTeam('A')}>
                <h2 className="text-3xl font-bold text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{teamA.name}</h2>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"><PencilIcon /></span>
             </div>
             
             <button 
                onClick={() => handlePoint('A')}
                className={`w-full max-w-sm aspect-square rounded-3xl ${teamA.color} shadow-2xl flex flex-col items-center justify-center text-white active:scale-95 transition-all relative overflow-hidden`}
             >
                <div className="text-[10rem] landscape:text-8xl font-black leading-none tracking-tighter">
                  {teamA.score}
                </div>
                {checkSetWin(teamA.score, teamB.score, currentSet-1) && !matchWinner && (
                  <div className="absolute bottom-6 font-bold text-xl uppercase tracking-widest opacity-80 animate-bounce">
                    {t(config.language, 'target')}
                  </div>
                )}
             </button>

             <div className="mt-6 flex gap-2">
                {Array.from({ length: config.setsToWin }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${i < teamA.setsWon ? teamA.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
             </div>
           </div>
        </div>

        {/* Team B */}
        <div className="flex-1 relative flex flex-col landscape:flex-col-reverse items-center justify-center p-4 transition-colors duration-300">
           <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundColor: teamB.color.replace('bg-', '') }}></div>

           <div className="z-10 flex flex-col items-center w-full h-full justify-center">
             <div className="flex items-center gap-2 mb-4 landscape:mt-4 landscape:mb-0 group cursor-pointer" onClick={() => renameTeam('B')}>
               <h2 className="text-3xl font-bold text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{teamB.name}</h2>
               <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"><PencilIcon /></span>
             </div>
             
             <button 
                onClick={() => handlePoint('B')}
                className={`w-full max-w-sm aspect-square rounded-3xl ${teamB.color} shadow-2xl flex flex-col items-center justify-center text-white active:scale-95 transition-all relative overflow-hidden`}
             >
                <div className="text-[10rem] landscape:text-8xl font-black leading-none tracking-tighter">
                  {teamB.score}
                </div>
                {checkSetWin(teamB.score, teamA.score, currentSet-1) && !matchWinner && (
                  <div className="absolute bottom-6 font-bold text-xl uppercase tracking-widest opacity-80 animate-bounce">
                    {t(config.language, 'target')}
                  </div>
                )}
             </button>

             <div className="mt-6 landscape:mb-6 landscape:mt-0 flex gap-2">
                {Array.from({ length: config.setsToWin }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${i < teamB.setsWon ? teamB.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Match Winner Overlay */}
      {matchWinner && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
           <div className="text-6xl mb-6 animate-bounce">🏆</div>
           <h2 className="text-xl text-slate-400 uppercase tracking-widest font-bold mb-2">{t(config.language, 'matchWinner')}</h2>
           <h1 className={`text-6xl font-black text-white mb-8 text-center ${teamA.name === matchWinner ? 'text-blue-400' : 'text-red-400'}`}>
             {matchWinner}
           </h1>
           
           <div className="bg-white/10 rounded-2xl p-6 mb-8 w-full max-w-md backdrop-blur-sm">
              <div className="text-center text-slate-300 font-bold mb-4 uppercase text-sm tracking-widest">{t(config.language, 'finalScore')}</div>
              <div className="flex justify-between items-center text-4xl font-black text-white mb-6 border-b border-white/10 pb-6">
                 <div>{teamA.name} <span className="text-blue-400 text-5xl ml-2">{teamA.setsWon}</span></div>
                 <div className="text-slate-500 text-2xl">-</div>
                 <div><span className="text-red-400 text-5xl mr-2">{teamB.setsWon}</span> {teamB.name}</div>
              </div>

              <div className="space-y-2">
                 <div className="text-center text-slate-400 text-xs font-bold uppercase mb-2">{t(config.language, 'sets')}</div>
                 <div className="grid grid-cols-1 gap-2">
                    {history.filter(h => h.type === 'SET_WIN' || h.type === 'MATCH_WIN').map((set, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-black/20 p-2 rounded px-4">
                          <span className="text-slate-400 font-mono text-sm">#{idx+1}</span>
                          <div className="flex gap-4 font-bold text-lg">
                             <span className={set.scoreSnapshot.a > set.scoreSnapshot.b ? 'text-yellow-400' : 'text-slate-400'}>{set.scoreSnapshot.a}</span>
                             <span className="text-slate-600">-</span>
                             <span className={set.scoreSnapshot.b > set.scoreSnapshot.a ? 'text-yellow-400' : 'text-slate-400'}>{set.scoreSnapshot.b}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-3 w-full max-w-xs">
             <Button size="lg" onClick={handleShare} className="w-full">
               <ShareIcon /> {t(config.language, 'share')}
             </Button>
             <Button variant="secondary" onClick={handleReset} className="w-full">
               {t(config.language, 'startNewMatch')}
             </Button>
           </div>
        </div>
      )}

    </div>
  );
}