import React, { useState, useEffect, useRef } from 'react';
import { TeamState, MatchConfig, HistoryEvent } from './types';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { SetupScreen } from './components/SetupScreen';
import { Button } from './components/Button';
import { Toast } from './components/Toast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { InputModal } from './components/InputModal';
import { playPointSound, playSetWinSound, playMatchWinSound } from './services/soundService';
import { t } from './utils/translations';
import { getTeamColorToken } from './utils/teamColors';
import { useDialogA11y } from './utils/useDialogA11y';
import { MatchTimer } from './components/MatchTimer';

// Icons
const CogIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UndoIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
const RefreshIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const ChartIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ShareIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

export default function App() {
  const winnerDialogRef = useRef<HTMLDivElement>(null);
  const winnerShareButtonRef = useRef<HTMLButtonElement>(null);

  // Config State with LocalStorage Persistence
  const [config, setConfig] = useState<MatchConfig>(() => {
    const defaultConfig: MatchConfig = {
      pointsPerSet: 25,
      lastSetPoints: 15,
      setsToWin: 2, // Best of 3
      winByTwo: true,
      isDarkMode: true,
      enableSound: true,
      language: 'en',
    };

    try {
      const saved = localStorage.getItem('volleyscore_config');
      if (saved) {
        return { ...defaultConfig, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to parse config from local storage", e);
    }
    return defaultConfig;
  });

  // Save Config Effect
  useEffect(() => {
    localStorage.setItem('volleyscore_config', JSON.stringify(config));
  }, [config]);

  // Apply Theme
  useEffect(() => {
    if (config.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.lang = config.language;
  }, [config.isDarkMode, config.language]);

  // App Flow State
  const [isMatchStarted, setIsMatchStarted] = useState(false);

  // Game State
  const [teamA, setTeamA] = useState<TeamState>({ name: 'Home', score: 0, setsWon: 0, color: 'bg-blue-600' });
  const [teamB, setTeamB] = useState<TeamState>({ name: 'Guest', score: 0, setsWon: 0, color: 'bg-red-600' });
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [matchWinner, setMatchWinner] = useState<string | null>(null);

  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerResetSignal, setTimerResetSignal] = useState(0);

  // Modals & Popups State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [renamingTeam, setRenamingTeam] = useState<'A' | 'B' | null>(null);

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
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
    setTimerResetSignal(prev => prev + 1);
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
    }

    // If we undo the very first point, reset the timer
    if (history.length === 1) {
       setIsTimerRunning(false);
       setTimerResetSignal(prev => prev + 1);
    }
  };

  const handleResetRequest = () => {
    setIsResetConfirmOpen(true);
  };

  const performReset = () => {
    setIsMatchStarted(false);
    setIsTimerRunning(false);
    setTimerResetSignal(prev => prev + 1);
    setIsResetConfirmOpen(false);
  };

  const handleShare = async () => {
    let text = '';
    
    if (matchWinner) {
      // Format similar to matchWinner overlay
      text = `🏆 ${t(config.language, 'matchWinner')}\n\n`;
      text += `${matchWinner}\n\n`;
      text += `${t(config.language, 'finalScore')}\n`;
      text += `${teamA.name} ${teamA.setsWon} - ${teamB.setsWon} ${teamB.name}\n\n`;
      
      // Add set-by-set breakdown
      const completedSets = history.filter(h => h.type === 'SET_WIN' || h.type === 'MATCH_WIN');
      if (completedSets.length > 0) {
        text += `${t(config.language, 'sets')}:\n`;
        completedSets.forEach((set, idx) => {
          const winner = set.scoreSnapshot.a > set.scoreSnapshot.b ? teamA.name : teamB.name;
          text += `${t(config.language, 'set')} ${idx + 1}: ${set.scoreSnapshot.a}-${set.scoreSnapshot.b} (${winner})\n`;
        });
      }
    } else {
      // Current match state
      const currentSet = teamA.setsWon + teamB.setsWon + 1;
      text = `${t(config.language, 'matchUpdate')}\n\n`;
      text += `${teamA.name} ${teamA.setsWon} - ${teamB.setsWon} ${teamB.name}\n`;
      text += `${t(config.language, 'set')} ${currentSet}: ${teamA.score}-${teamB.score}`;
    }

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
      showToast(t(config.language, 'copied'));
    }
  };

  const handleRenameRequest = (team: 'A' | 'B') => {
    setRenamingTeam(team);
  };

  const handleRenameSave = (newName: string) => {
    if (newName && newName.trim() && renamingTeam) {
      if (renamingTeam === 'A') setTeamA(prev => ({...prev, name: newName.trim()}));
      else setTeamB(prev => ({...prev, name: newName.trim()}));
    }
    setRenamingTeam(null);
  };

  useDialogA11y(winnerDialogRef, {
    isOpen: !!matchWinner,
    onClose: handleResetRequest,
    initialFocusRef: winnerShareButtonRef,
  });

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
  const teamAColor = getTeamColorToken(teamA.color);
  const teamBColor = getTeamColorToken(teamB.color);

  // Use min-h-0 to allow flex items to shrink below their content size if needed, ensuring exact fit
  return (
    <div className="relative flex h-full select-none flex-col overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-18%] h-64 w-64 rounded-full blur-3xl" style={{ background: teamAColor.tint }} />
        <div className="absolute right-[-8%] bottom-[-12%] h-72 w-72 rounded-full blur-3xl" style={{ background: teamBColor.tint }} />
      </div>
      
      {/* Toast Notification - aria-live for announcements */}
      <div aria-live="polite">
        <Toast 
          message={toastMessage || ''} 
          isVisible={!!toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      </div>

      {/* Confirmation Modal for Reset */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={performReset}
        title={t(config.language, 'resetMatchTitle')}
        message={t(config.language, 'resetMatchBody')}
        language={config.language}
      />

      {/* Input Modal for Renaming */}
      <InputModal
        isOpen={!!renamingTeam}
        onClose={() => setRenamingTeam(null)}
        onSave={handleRenameSave}
        title={t(config.language, 'renameTeamTitle')}
        initialValue={renamingTeam === 'A' ? teamA.name : (renamingTeam === 'B' ? teamB.name : '')}
        language={config.language}
      />
      
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

      {/* Top Bar - Fixed Height */}
      <header className="z-10 mx-3 mt-3 flex h-16 shrink-0 items-center justify-between rounded-[1.7rem] border border-slate-200/70 bg-white/84 px-3 shadow-[0_16px_32px_-30px_rgba(15,23,42,0.45)] transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/88">
        <div className="flex items-center gap-1.5">
           <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)} aria-label={t(config.language, 'settings')}>
             <CogIcon />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => setIsStatsOpen(true)} aria-label={t(config.language, 'matchStatsBtn')}>
             <ChartIcon />
           </Button>
        </div>
        
        <MatchTimer
          isRunning={isTimerRunning}
          language={config.language}
          onToggle={handleToggleTimer}
          resetSignal={timerResetSignal}
        />

        <div className="flex items-center gap-1.5">
           <Button variant="ghost" size="sm" onClick={handleShare} aria-label={t(config.language, 'share')}>
             <ShareIcon />
           </Button>
           <Button variant="ghost" size="sm" onClick={handleResetRequest} aria-label={t(config.language, 'resetMatch')}>
             <RefreshIcon />
           </Button>
        </div>
      </header>

      {/* Main Scoreboard Area - Flex Column forces fit, min-h-0 prevents overflow */}
      <main className="relative flex flex-1 flex-col min-h-0 landscape:flex-row px-3 pb-3 pt-3 gap-3">
        
        {/* Undo Button (Absolute Center) */}
        {history.length > 0 && !matchWinner && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
             <button 
               onClick={handleUndo}
               className="pointer-events-auto rounded-full border-4 border-slate-100 bg-white p-4 text-slate-500 shadow-[0_24px_48px_-30px_rgba(15,23,42,0.9)] transition-all hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
               aria-label={t(config.language, 'undo')}
             >
               <UndoIcon />
             </button>
          </div>
        )}

        {/* Team A Section */}
        <section className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden rounded-[2.1rem] border border-slate-200/70 bg-white/88 shadow-[0_22px_48px_-40px_rgba(15,23,42,0.56)] transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/88">
           {/* Background Tint */}
           <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, ${teamAColor.tint}, transparent 55%)` }}></div>
           
           {/* Content Container - Flex to fit */}
           <div className="z-10 flex flex-col items-center w-full h-full min-h-0">
             
             {/* Name Header */}
             <button 
               className="group z-20 flex w-full shrink-0 items-center justify-center gap-2 px-4 pt-4 pb-2" 
               onClick={() => handleRenameRequest('A')}
               aria-label={`${t(config.language, 'renameTeamTitle')} ${teamA.name}`}
             >
                <h2 className="max-w-[min(72vw,200px)] truncate font-display text-xl font-black uppercase tracking-[0.02em] text-slate-900 dark:text-white sm:text-2xl">{teamA.name}</h2>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 dark:text-slate-300" aria-hidden="true"><PencilIcon /></span>
             </button>
             <div className="mb-3 flex min-w-0 flex-wrap items-center justify-center gap-2 rounded-full bg-white/92 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.28em] text-slate-700 shadow-[0_10px_18px_-16px_rgba(15,23,42,0.5)] dark:bg-slate-950/62 dark:text-slate-200">
               <span className="rounded-full px-2.5 py-1 text-white shrink-0" style={{ backgroundColor: teamAColor.swatch }}>{t(config.language, 'teamBadgeA')}</span>
               <span>{t(config.language, 'set')} {currentSet}</span>
             </div>
             
             {/* Huge Score Button (Fills remaining space) */}
             <button 
                onClick={() => handlePoint('A')}
                aria-label={`${t(config.language, 'scorePointFor')} ${teamA.name}. ${t(config.language, 'currentScoreIs')} ${teamA.score}`}
                className={`relative mx-4 mb-3 flex min-h-0 w-[calc(100%-2rem)] flex-1 items-center justify-center overflow-hidden rounded-[2rem] ${teamA.color} shadow-[inset_0_0_90px_rgba(255,255,255,0.08),inset_0_-24px_42px_rgba(15,23,42,0.25),0_30px_50px_-30px_rgba(15,23,42,0.55)] transition-all active:scale-[0.995] active:opacity-95`}
                style={{ boxShadow: `inset 0 0 90px rgba(255,255,255,0.08), inset 0 -24px 42px rgba(15,23,42,0.25), 0 24px 50px -28px ${teamAColor.glow}` }}
             >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_38%)]" aria-hidden="true" />
                <div className="absolute left-3 top-3 rounded-full border border-white/25 bg-slate-950/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/95 sm:left-5 sm:top-5 sm:px-3 sm:text-[11px] sm:tracking-[0.24em]" aria-hidden="true">
                  {t(config.language, 'tapToScore')}
                </div>
                <div className="px-4 text-[clamp(4.75rem,18vw,10rem)] font-black leading-none tracking-[-0.08em] text-white drop-shadow-md select-none landscape:text-[clamp(4rem,15vh,9rem)]">
                  {teamA.score}
                </div>
                
                {/* Target Indicator */}
                {checkSetWin(teamA.score, teamB.score, currentSet-1) && !matchWinner && (
                  <div className="absolute bottom-3 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/95 sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm sm:tracking-[0.24em]">
                    {t(config.language, 'target')}
                  </div>
                )}
             </button>

             {/* Sets Won Indicators */}
             <div className="flex shrink-0 gap-2 pb-4" role="status" aria-label={`${t(config.language, 'setsWonStatus')} ${teamA.name}: ${teamA.setsWon}`}>
                {Array.from({ length: config.setsToWin }).map((_, i) => (
                  <div key={i} className={`h-4 w-10 rounded-full border border-white/30 shadow-sm ${i < teamA.setsWon ? teamA.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
             </div>
           </div>
        </section>

        {/* Team B Section */}
        <section className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden rounded-[2.1rem] border border-slate-200/70 bg-white/88 shadow-[0_22px_48px_-40px_rgba(15,23,42,0.56)] transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/88">
           {/* Background Tint */}
           <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, ${teamBColor.tint}, transparent 55%)` }}></div>

           {/* Content Container */}
           <div className="z-10 flex flex-col items-center w-full h-full min-h-0">
             
             {/* Name Header */}
             <button 
               className="group z-20 flex w-full shrink-0 items-center justify-center gap-2 px-4 pt-4 pb-2" 
               onClick={() => handleRenameRequest('B')}
               aria-label={`${t(config.language, 'renameTeamTitle')} ${teamB.name}`}
             >
               <h2 className="max-w-[min(72vw,200px)] truncate font-display text-xl font-black uppercase tracking-[0.02em] text-slate-900 dark:text-white sm:text-2xl">{teamB.name}</h2>
               <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 dark:text-slate-300" aria-hidden="true"><PencilIcon /></span>
             </button>
             <div className="mb-3 flex min-w-0 flex-wrap items-center justify-center gap-2 rounded-full bg-white/92 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.28em] text-slate-700 shadow-[0_10px_18px_-16px_rgba(15,23,42,0.5)] dark:bg-slate-950/62 dark:text-slate-200">
               <span className="rounded-full px-2.5 py-1 text-white shrink-0" style={{ backgroundColor: teamBColor.swatch }}>{t(config.language, 'teamBadgeB')}</span>
               <span>{t(config.language, 'set')} {currentSet}</span>
             </div>
             
             {/* Huge Score Button */}
             <button 
                onClick={() => handlePoint('B')}
                aria-label={`${t(config.language, 'scorePointFor')} ${teamB.name}. ${t(config.language, 'currentScoreIs')} ${teamB.score}`}
                className={`relative mx-4 mb-3 flex min-h-0 w-[calc(100%-2rem)] flex-1 items-center justify-center overflow-hidden rounded-[2rem] ${teamB.color} shadow-[inset_0_0_90px_rgba(255,255,255,0.08),inset_0_-24px_42px_rgba(15,23,42,0.25),0_30px_50px_-30px_rgba(15,23,42,0.55)] transition-all active:scale-[0.995] active:opacity-95`}
                style={{ boxShadow: `inset 0 0 90px rgba(255,255,255,0.08), inset 0 -24px 42px rgba(15,23,42,0.25), 0 24px 50px -28px ${teamBColor.glow}` }}
             >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_38%)]" aria-hidden="true" />
                <div className="absolute left-3 top-3 rounded-full border border-white/25 bg-slate-950/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/95 sm:left-5 sm:top-5 sm:px-3 sm:text-[11px] sm:tracking-[0.24em]" aria-hidden="true">
                  {t(config.language, 'tapToScore')}
                </div>
                <div className="px-4 text-[clamp(4.75rem,18vw,10rem)] font-black leading-none tracking-[-0.08em] text-white drop-shadow-md select-none landscape:text-[clamp(4rem,15vh,9rem)]">
                  {teamB.score}
                </div>
                
                {checkSetWin(teamB.score, teamA.score, currentSet-1) && !matchWinner && (
                  <div className="absolute bottom-3 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/95 sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm sm:tracking-[0.24em]">
                    {t(config.language, 'target')}
                  </div>
                )}
             </button>

             {/* Sets Won Indicators */}
             <div className="flex shrink-0 gap-2 pb-4" role="status" aria-label={`${t(config.language, 'setsWonStatus')} ${teamB.name}: ${teamB.setsWon}`}>
                {Array.from({ length: config.setsToWin }).map((_, i) => (
                  <div key={i} className={`h-4 w-10 rounded-full border border-white/30 shadow-sm ${i < teamB.setsWon ? teamB.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
             </div>
           </div>
        </section>
      </main>

      {/* Match Winner Overlay */}
      {matchWinner && (
        <div ref={winnerDialogRef} tabIndex={-1} className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-slate-950/92 p-6 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="winner-title">
           <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
             <div className="absolute left-[-12%] top-[10%] h-72 w-72 rounded-full blur-3xl" style={{ background: teamAColor.glow }} />
             <div className="absolute right-[-12%] top-[12%] h-72 w-72 rounded-full blur-3xl" style={{ background: teamBColor.glow }} />
             <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(15,23,42,0.9))]" />
           </div>
           <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] shadow-[0_16px_32px_-24px_rgba(0,0,0,0.7)]" aria-hidden="true">
             <div className="text-6xl">🏆</div>
           </div>
           <h2 id="winner-title" className="relative z-10 mb-2 text-xl font-black uppercase tracking-[0.28em] text-slate-200">{t(config.language, 'matchWinner')}</h2>
           <h1 className="relative z-10 mb-3 px-4 text-center font-display text-[clamp(2.8rem,11vw,3.75rem)] font-black uppercase tracking-[-0.02em] leading-none break-words drop-shadow-[0_14px_30px_rgba(15,23,42,0.6)]" style={{ color: teamA.name === matchWinner ? teamAColor.highlight : teamBColor.highlight }}>
             {matchWinner}
           </h1>
           <div className="relative z-10 mb-8 h-1 w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${teamAColor.swatch}, ${teamBColor.swatch})` }} aria-hidden="true" />
           
           <div className="relative z-10 mb-8 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/8 bg-slate-900/84 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.78)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" aria-hidden="true" />
              <div className="mb-4 text-center text-sm font-bold uppercase tracking-[0.26em] text-slate-300">{t(config.language, 'finalScore')}</div>
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-6 text-[clamp(1.35rem,6vw,2.25rem)] font-black text-white">
                 <div className="min-w-0 break-words">{teamA.name} <span className="ml-2 text-[clamp(2rem,7vw,3rem)]" style={{ color: teamAColor.highlight }}>{teamA.setsWon}</span></div>
                 <div className="text-slate-500 text-2xl" aria-hidden="true">-</div>
                 <div className="min-w-0 break-words text-right"><span className="mr-2 text-[clamp(2rem,7vw,3rem)]" style={{ color: teamBColor.highlight }}>{teamB.setsWon}</span> {teamB.name}</div>
              </div>

              <div className="space-y-2">
                 <div className="mb-2 text-center text-xs font-bold uppercase text-slate-400">{t(config.language, 'sets')}</div>
                 <div className="grid grid-cols-1 gap-2">
                    {history.filter(h => h.type === 'SET_WIN' || h.type === 'MATCH_WIN').map((set, idx) => (
                       <div key={idx} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/6 px-4 py-2">
                          <span className="text-slate-400 font-mono text-sm">#{idx+1}</span>
                          <div className="flex gap-4 font-bold text-lg">
                             <span style={{ color: set.scoreSnapshot.a > set.scoreSnapshot.b ? teamAColor.highlight : '#94a3b8' }}>{set.scoreSnapshot.a}</span>
                             <span className="text-slate-600">-</span>
                             <span style={{ color: set.scoreSnapshot.b > set.scoreSnapshot.a ? teamBColor.highlight : '#94a3b8' }}>{set.scoreSnapshot.b}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="relative z-10 flex w-full max-w-xs flex-col gap-3">
             <Button ref={winnerShareButtonRef} size="lg" onClick={handleShare} className="w-full" icon={<ShareIcon />}>
                {t(config.language, 'share')}
             </Button>
             <Button variant="secondary" onClick={handleResetRequest} className="w-full">
               {t(config.language, 'startNewMatch')}
             </Button>
           </div>
        </div>
      )}

    </div>
  );
}
