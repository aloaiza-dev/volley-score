
import { useState, useEffect, useCallback, useRef } from 'react';
import { TeamState, MatchConfig, HistoryEvent } from './types';
import { SettingsModal } from './components/SettingsModal';
import { SummaryModal } from './components/SummaryModal';
import { StatsModal } from './components/StatsModal';
import { SetupScreen } from './components/SetupScreen';
import { Button } from './components/Button';
import { playPointSound, playSetWinSound, playMatchWinSound } from './services/soundService';
import { t } from './utils/translations';

// Icons
const CogIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UndoIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
const SparklesIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const RefreshIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const ChartIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlayIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShareIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

export default function App() {
  // Config State
  const [config, setConfig] = useState<MatchConfig>({
    pointsPerSet: 25,
    lastSetPoints: 15,
    setsToWin: 2, // Best of 3
    winByTwo: true,
    enableAI: true,
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
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
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

  // Computed: Is this the tie-breaker set?
  const isTieBreaker = (teamA.setsWon + teamB.setsWon) === (config.setsToWin * 2 - 2);
  const currentSetTarget = isTieBreaker ? config.lastSetPoints : config.pointsPerSet;

  // --- Logic ---

  const checkSetWinner = (scoreA: number, scoreB: number): 'A' | 'B' | null => {
    const reachedTarget = scoreA >= currentSetTarget || scoreB >= currentSetTarget;
    if (!reachedTarget) return null;

    const diff = Math.abs(scoreA - scoreB);
    if (config.winByTwo && diff < 2) return null;

    return scoreA > scoreB ? 'A' : 'B';
  };

  const handlePoint = (team: 'A' | 'B') => {
    if (matchWinner) return;

    // Start timer on point score if not running (covers start of match and start of new sets)
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    // Throttle fast clicks slightly
    const now = Date.now();
    if (now - lastActionTime.current < 100) return;
    lastActionTime.current = now;

    const newScoreA = team === 'A' ? teamA.score + 1 : teamA.score;
    const newScoreB = team === 'B' ? teamB.score + 1 : teamB.score;

    // Snapshot for history
    const historyEvent: HistoryEvent = {
      team,
      type: 'POINT',
      setIndex: teamA.setsWon + teamB.setsWon + 1,
      scoreSnapshot: { a: teamA.score, b: teamB.score },
      timestamp: Date.now()
    };

    // Check for set win immediately
    const setWinner = checkSetWinner(newScoreA, newScoreB);

    if (setWinner) {
      // Set Finished
      // Pause timer when set is finished
      setIsTimerRunning(false);

      const newSetsA = setWinner === 'A' ? teamA.setsWon + 1 : teamA.setsWon;
      const newSetsB = setWinner === 'B' ? teamB.setsWon + 1 : teamB.setsWon;
      
      // Update history with SET_WIN type implicitly by state transition or explicit log
      setHistory(prev => [...prev, { ...historyEvent, type: 'SET_WIN', scoreSnapshot: { a: newScoreA, b: newScoreB } }]);

      // Check Match Win
      if (newSetsA === config.setsToWin) {
        setMatchWinner(teamA.name);
        setTeamA(prev => ({ ...prev, score: newScoreA, setsWon: newSetsA }));
        setTeamB(prev => ({ ...prev, score: newScoreB, setsWon: newSetsB }));
        if (config.enableSound) playMatchWinSound();
        if (config.enableAI) setIsSummaryOpen(true);
      } else if (newSetsB === config.setsToWin) {
        setMatchWinner(teamB.name);
        setTeamA(prev => ({ ...prev, score: newScoreA, setsWon: newSetsA }));
        setTeamB(prev => ({ ...prev, score: newScoreB, setsWon: newSetsB }));
        if (config.enableSound) playMatchWinSound();
        if (config.enableAI) setIsSummaryOpen(true);
      } else {
        // Start Next Set
        setTeamA(prev => ({ ...prev, score: 0, setsWon: newSetsA }));
        setTeamB(prev => ({ ...prev, score: 0, setsWon: newSetsB }));
        if (config.enableSound) playSetWinSound();
      }
    } else {
      // Just a point
      setTeamA(prev => ({ ...prev, score: newScoreA }));
      setTeamB(prev => ({ ...prev, score: newScoreB }));
      setHistory(prev => [...prev, historyEvent]);
      if (config.enableSound) playPointSound();
    }
  };

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    
    // Get last event
    const lastEvent = history[history.length - 1];
    
    // If we are undoing the very first point of the match, reset the timer
    if (history.length === 1) {
      setMatchDuration(0);
      setIsTimerRunning(false);
    }

    // Revert state
    if (lastEvent.type === 'SET_WIN' || lastEvent.type === 'MATCH_WIN') {
       // Restore previous sets and score
       setTeamA(prev => ({ ...prev, score: lastEvent.scoreSnapshot.a, setsWon: lastEvent.team === 'A' ? prev.setsWon - 1 : prev.setsWon }));
       setTeamB(prev => ({ ...prev, score: lastEvent.scoreSnapshot.b, setsWon: lastEvent.team === 'B' ? prev.setsWon - 1 : prev.setsWon }));
       setMatchWinner(null);
    } else {
       // Simple point undo
       setTeamA(prev => ({ ...prev, score: lastEvent.scoreSnapshot.a }));
       setTeamB(prev => ({ ...prev, score: lastEvent.scoreSnapshot.b }));
    }

    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const resetMatch = () => {
    if (window.confirm(t(config.language, 'resetConfirm'))) {
      setTeamA(prev => ({ ...prev, score: 0, setsWon: 0 }));
      setTeamB(prev => ({ ...prev, score: 0, setsWon: 0 }));
      setHistory([]);
      setMatchWinner(null);
      setMatchDuration(0);
      setIsTimerRunning(false);
      setIsMatchStarted(false); // Go back to setup
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleShare = async () => {
    const title = t(config.language, matchWinner ? 'finalScore' : 'matchUpdate');
    const text = `🏐 VolleyScore Pro\n\n${title}:\n${teamA.name} vs ${teamB.name}\n${t(config.language, 'sets')}: ${teamA.setsWon} - ${teamB.setsWon}\n${t(config.language, 'score')}: ${teamA.score} - ${teamB.score}\n${t(config.language, 'setLabel')} ${teamA.setsWon + teamB.setsWon + 1}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VolleyScore Pro',
          text: text,
        });
      } catch (err) {
        // User cancelled or share failed
        console.debug('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert(t(config.language, 'copied'));
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleRenameTeam = (team: 'A' | 'B') => {
    const currentName = team === 'A' ? teamA.name : teamB.name;
    const newName = window.prompt(t(config.language, 'enterTeamName'), currentName);
    
    if (newName && newName.trim().length > 0) {
      if (team === 'A') {
        setTeamA(prev => ({ ...prev, name: newName.trim() }));
      } else {
        setTeamB(prev => ({ ...prev, name: newName.trim() }));
      }
    }
  };

  // If match hasn't started, show setup screen
  if (!isMatchStarted) {
    return (
      <SetupScreen 
        config={config} 
        onUpdateConfig={setConfig} 
        teamA={teamA} 
        setTeamA={setTeamA} 
        teamB={teamB} 
        setTeamB={setTeamB}
        onStartMatch={() => setIsMatchStarted(true)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black transition-colors duration-300">
      
      {/* --- Top Bar (Controls) --- */}
      <div className="h-16 landscape:h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-10 shrink-0 transition-all shadow-sm dark:shadow-none">
        <div className="flex gap-1 items-center">
           <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)} icon={<CogIcon />} />
           <Button variant="ghost" size="sm" onClick={resetMatch} icon={<RefreshIcon />} />
        </div>
        
        {/* Center: Score/Timer Info */}
        <div className="flex flex-col items-center justify-center">
           <div className="text-slate-500 dark:text-slate-400 font-bold text-xs tracking-wider uppercase">
             {t(config.language, 'setLabel')} {teamA.setsWon + teamB.setsWon + 1}
           </div>
           
           {/* Timer Display */}
           <div 
             onClick={toggleTimer}
             className="flex items-center gap-1.5 cursor-pointer select-none active:scale-95 transition-transform bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 mt-0.5"
             title={isTimerRunning ? t(config.language, 'timerRunning') : t(config.language, 'timerPaused')}
           >
              {isTimerRunning ? (
                 <span className="text-green-500 animate-pulse"><ClockIcon /></span>
              ) : (
                 <span className="text-slate-400"><PlayIcon /></span>
              )}
              <span className={`font-mono font-bold text-sm ${isTimerRunning ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {formatTime(matchDuration)}
              </span>
           </div>
        </div>

        <div className="flex gap-1 items-center">
           <Button variant="ghost" size="sm" onClick={handleShare} icon={<ShareIcon />} />
           <Button 
             variant="ghost" 
             size="sm" 
             disabled={history.length === 0} 
             onClick={handleUndo} 
             icon={<UndoIcon />} 
             className={history.length === 0 ? 'opacity-30' : ''}
           />
           <Button variant="ghost" size="sm" onClick={() => setIsStatsOpen(true)} icon={<ChartIcon />} />
           {config.enableAI && (
             <Button variant="ghost" size="sm" onClick={() => setIsSummaryOpen(true)} icon={<SparklesIcon />} className="text-purple-600 dark:text-yellow-400" />
           )}
        </div>
      </div>

      {/* --- Main Game Area --- */}
      <div className="flex-1 flex flex-col landscape:flex-row relative overflow-hidden">
        
        {/* Team A (Top in Portrait, Left in Landscape) */}
        <div 
          className={`flex-1 flex flex-col items-center justify-center relative transition-colors duration-300 ${teamA.color} active:brightness-110 cursor-pointer select-none`}
          onClick={() => handlePoint('A')}
        >
           {/* Sets Indicators */}
           <div className="absolute top-4 left-4 flex gap-2">
             {Array.from({ length: config.setsToWin }).map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 border-white/50 ${i < teamA.setsWon ? 'bg-white' : 'bg-transparent'}`} />
             ))}
           </div>

           <div 
             className="text-white/80 font-bold text-2xl uppercase tracking-widest mb-2 flex items-center gap-2 hover:bg-black/20 px-3 py-1 rounded-lg transition-colors cursor-pointer z-20"
             onClick={(e) => { e.stopPropagation(); handleRenameTeam('A'); }}
             title="Edit Name"
           >
              {teamA.name} <PencilIcon />
           </div>
           <div className="text-[10rem] landscape:text-8xl font-bold text-white leading-none tabular-nums drop-shadow-lg" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
             {teamA.score}
           </div>
        </div>

        {/* Divider / Net */}
        <div className="h-2 w-full landscape:w-2 landscape:h-full bg-slate-200 dark:bg-black flex items-center justify-center relative shrink-0 z-10 transition-colors duration-300">
           <div className="absolute bg-white dark:bg-slate-800 px-4 py-1 rounded-full text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 whitespace-nowrap z-20 shadow-sm">
              {t(config.language, 'target')}: {currentSetTarget}
           </div>
        </div>

        {/* Team B (Bottom in Portrait, Right in Landscape) */}
        <div 
          className={`flex-1 flex flex-col landscape:flex-col-reverse items-center justify-center relative transition-colors duration-300 ${teamB.color} active:brightness-110 cursor-pointer select-none`}
          onClick={() => handlePoint('B')}
        >
           <div className="text-[10rem] landscape:text-8xl font-bold text-white leading-none tabular-nums drop-shadow-lg" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
             {teamB.score}
           </div>
           <div 
             className="text-white/80 font-bold text-2xl uppercase tracking-widest mt-2 landscape:mt-0 landscape:mb-2 flex items-center gap-2 hover:bg-black/20 px-3 py-1 rounded-lg transition-colors cursor-pointer z-20"
             onClick={(e) => { e.stopPropagation(); handleRenameTeam('B'); }}
             title="Edit Name"
           >
             {teamB.name} <PencilIcon />
           </div>

           {/* Sets Indicators (Bottom Aligned in Portrait) */}
           <div className="absolute bottom-4 left-4 landscape:bottom-4 landscape:left-4 flex gap-2">
             {Array.from({ length: config.setsToWin }).map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 border-white/50 ${i < teamB.setsWon ? 'bg-white' : 'bg-transparent'}`} />
             ))}
           </div>
        </div>
        
        {/* Winner Overlay */}
        {matchWinner && (
          <div className="absolute inset-0 z-40 bg-white/90 dark:bg-black/85 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 backdrop-blur-sm">
             <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full transform transition-all hover:scale-105">
                <div className="text-7xl mb-4 animate-bounce filter drop-shadow-md">🏆</div>
                <h2 className="text-2xl font-black text-white/90 uppercase tracking-widest mb-1">{t(config.language, 'matchWinner')}</h2>
                
                {/* Winner Name with Animation */}
                <div className="text-4xl font-extrabold text-white mb-6 drop-shadow-sm animate-pulse">
                   {matchWinner}
                </div>

                {/* Final Score Display */}
                <div className="bg-white/20 rounded-2xl px-6 py-4 mb-6 backdrop-blur-sm border border-white/30 w-full">
                  <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 text-center">{t(config.language, 'finalSets')}</div>
                  <div className="text-5xl font-black text-white flex items-center justify-center gap-4 mb-4">
                    <span>{teamA.setsWon}</span>
                    <span className="text-white/50 text-3xl">-</span>
                    <span>{teamB.setsWon}</span>
                  </div>

                  {/* Set by Set Breakdown */}
                  <div className="w-full border-t border-white/20 pt-3">
                     <div className="grid grid-cols-[1fr_auto_1fr] gap-4 text-xs font-bold text-white/90 mb-2 px-2">
                        <div className="text-right truncate">{teamA.name}</div>
                        <div className="w-6 text-center text-white/50">{t(config.language, 'vs')}</div>
                        <div className="text-left truncate">{teamB.name}</div>
                     </div>
                     <div className="space-y-1">
                        {history.filter(h => h.type === 'SET_WIN').map((h, i) => (
                           <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-4 text-base font-mono text-white px-2">
                              <div className={`text-right ${h.scoreSnapshot.a > h.scoreSnapshot.b ? 'text-yellow-300 font-bold' : 'opacity-80'}`}>
                                {h.scoreSnapshot.a}
                              </div>
                              <div className="w-6 text-center opacity-50 text-xs flex items-center justify-center pt-1">{i + 1}</div>
                              <div className={`text-left ${h.scoreSnapshot.b > h.scoreSnapshot.a ? 'text-yellow-300 font-bold' : 'opacity-80'}`}>
                                {h.scoreSnapshot.b}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 w-full">
                  <Button variant="secondary" onClick={handleShare} className="bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold">
                    <ShareIcon /> {t(config.language, 'share')}
                  </Button>
                  <div className="flex gap-2 w-full">
                    <Button variant="secondary" onClick={() => setIsStatsOpen(true)} className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold text-sm">
                      <ChartIcon /> {t(config.language, 'stats')}
                    </Button>
                    {config.enableAI && (
                      <Button variant="secondary" onClick={() => setIsSummaryOpen(true)} className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold text-sm">
                        <SparklesIcon /> AI
                      </Button>
                    )}
                  </div>
                  <Button onClick={resetMatch} className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-lg mt-2">
                    {t(config.language, 'startNewMatch')}
                  </Button>
                </div>
             </div>
          </div>
        )}

      </div>

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

      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        teamA={teamA}
        teamB={teamB}
        history={history}
        isMatchOver={!!matchWinner}
        config={config}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        teamA={teamA}
        teamB={teamB}
        history={history}
        config={config}
      />
    </div>
  );
}
