import React, { useEffect, useState } from 'react';
import { Language, t } from '../utils/translations';

interface MatchTimerProps {
  isRunning: boolean;
  language: Language;
  onToggle: () => void;
  resetSignal: number;
}

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const MatchTimer = React.memo(function MatchTimer({
  isRunning,
  language,
  onToggle,
  resetSignal,
}: MatchTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
  }, [resetSignal]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  return (
    <button
      className="flex min-w-[116px] flex-col items-center rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-1.5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/90"
      onClick={onToggle}
      aria-label={isRunning ? t(language, 'pauseTimer') : t(language, 'resumeTimer')}
      title={isRunning ? t(language, 'timerRunning') : t(language, 'timerPaused')}
    >
      <div className="flex items-center gap-2 text-xl font-black tabular-nums text-slate-900 dark:text-white">
        <span className={`h-2.5 w-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse-soft' : 'bg-slate-400'}`} aria-hidden="true"></span>
        {formatTime(elapsed)}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {isRunning ? t(language, 'timerRunning') : t(language, 'timerPaused')}
      </div>
    </button>
  );
});
