import React, { useMemo, useRef } from 'react';
import { TeamState, HistoryEvent, MatchConfig } from '../types';
import { Button } from './Button';
import { t } from '../utils/translations';
import { getTeamColorToken } from '../utils/teamColors';
import { useDialogA11y } from '../utils/useDialogA11y';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamA: TeamState;
  teamB: TeamState;
  history: HistoryEvent[];
  config: MatchConfig;
}

export const StatsModal: React.FC<StatsModalProps> = ({ 
  isOpen, onClose, teamA, teamB, history, config
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const stats = useMemo(() => {
    // Total Points
    const totalPointsA = history.filter(h => h.team === 'A').length;
    const totalPointsB = history.filter(h => h.team === 'B').length;
    const totalPoints = totalPointsA + totalPointsB;

    // Calculate Streaks
    let currentStreakA = 0;
    let maxStreakA = 0;
    let currentStreakB = 0;
    let maxStreakB = 0;

    history.forEach(h => {
      if (h.team === 'A') {
        currentStreakA++;
        currentStreakB = 0;
        if (currentStreakA > maxStreakA) maxStreakA = currentStreakA;
      } else {
        currentStreakB++;
        currentStreakA = 0;
        if (currentStreakB > maxStreakB) maxStreakB = currentStreakB;
      }
    });

    // Set History
    const setHistory = history.filter(h => h.type === 'SET_WIN' || h.type === 'MATCH_WIN');

    return {
      totalPointsA,
      totalPointsB,
      totalPoints,
      maxStreakA,
      maxStreakB,
      setHistory
    };
  }, [history]);

  useDialogA11y(dialogRef, {
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!isOpen) return null;

  // Helper for percentage bar
  const getPercent = (val: number, total: number) => {
    if (total === 0) return 50;
    return Math.round((val / total) * 100);
  };

  const pctA = getPercent(stats.totalPointsA, stats.totalPoints);
  const pctB = getPercent(stats.totalPointsB, stats.totalPoints);
  const teamAColor = getTeamColorToken(teamA.color);
  const teamBColor = getTeamColorToken(teamB.color);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/26 p-4 backdrop-blur-sm dark:bg-slate-950/60 dark:backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="stats-title">
      <div ref={dialogRef} tabIndex={-1} className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-[2rem] border border-slate-300/80 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.28)] transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/96 dark:shadow-[0_30px_80px_-36px_rgba(15,23,42,0.8)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-6 dark:border-slate-700">
           <h2 id="stats-title" className="min-w-0 font-display text-xl font-black uppercase tracking-[0.08em] text-slate-900 dark:text-white flex items-center gap-2 sm:text-2xl">
             📊 {t(config.language, 'matchStats')}
           </h2>
           <Button ref={closeButtonRef} variant="ghost" size="sm" onClick={onClose} aria-label={t(config.language, 'closeStats')}>✕</Button>
        </div>
        
        <div className="overflow-y-auto space-y-6 p-4 sm:space-y-8 sm:p-6 custom-scrollbar">
          
          {/* Total Points Visualization */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t(config.language, 'totalPoints')}</h3>
            <div className="mb-1 flex items-end justify-between text-2xl font-black">
               <span style={{ color: teamAColor.text }}>{stats.totalPointsA}</span>
               <span style={{ color: teamBColor.text }}>{stats.totalPointsB}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex" role="progressbar" aria-valuenow={pctA} aria-valuemin={0} aria-valuemax={100} aria-label={t(config.language, 'pointsDistribution')}>
              <div style={{ width: `${pctA}%`, backgroundColor: teamAColor.swatch }} className="transition-all duration-500" />
              <div style={{ width: `${pctB}%`, backgroundColor: teamBColor.swatch }} className="transition-all duration-500" />
            </div>
            <div className="mt-1 flex flex-wrap justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="min-w-0 truncate">{teamA.name} ({pctA}%)</span>
              <span className="min-w-0 truncate text-right">{teamB.name} ({pctB}%)</span>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-900/50 dark:border-slate-700">
               <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">{t(config.language, 'setsWon')}</div>
               <div className="flex justify-between items-center">
                 <div className="min-w-0 truncate pr-2 font-bold text-slate-900 dark:text-white">{teamA.name}</div>
                 <div className="text-2xl font-black text-slate-900 dark:text-white">{teamA.setsWon}</div>
               </div>
               <div className="flex justify-between items-center mt-1">
                 <div className="min-w-0 truncate pr-2 font-bold text-slate-900 dark:text-white">{teamB.name}</div>
                 <div className="text-2xl font-black text-slate-900 dark:text-white">{teamB.setsWon}</div>
               </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-900/50 dark:border-slate-700">
               <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">{t(config.language, 'longestStreak')}</div>
               <div className="flex justify-between items-center">
                 <div className="font-bold text-slate-900 dark:text-white truncate pr-2">{teamA.name}</div>
                 <div className="text-xl font-black" style={{ color: teamAColor.text }}>{stats.maxStreakA}</div>
               </div>
               <div className="flex justify-between items-center mt-1">
                 <div className="font-bold text-slate-900 dark:text-white truncate pr-2">{teamB.name}</div>
                 <div className="text-xl font-black" style={{ color: teamBColor.text }}>{stats.maxStreakB}</div>
               </div>
            </div>
          </div>

          {/* Detailed Set History Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">{t(config.language, 'setHistory')}</h3>
            {stats.setHistory.length === 0 ? (
               <div className="text-center py-6 text-slate-400 dark:text-slate-500 italic">{t(config.language, 'noSets')}</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-[30rem] w-full text-sm text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="px-4 py-3" scope="col">{t(config.language, 'set')}</th>
                      <th className="px-4 py-3" scope="col">{teamA.name}</th>
                      <th className="px-4 py-3" scope="col">{teamB.name}</th>
                      <th className="px-4 py-3 text-right" scope="col">{t(config.language, 'winner')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {stats.setHistory.map((set, idx) => (
                      <tr key={idx} className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">#{idx + 1}</td>
                        <td className={`px-4 py-3 font-bold ${set.scoreSnapshot.a > set.scoreSnapshot.b ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {set.scoreSnapshot.a}
                        </td>
                        <td className={`px-4 py-3 font-bold ${set.scoreSnapshot.b > set.scoreSnapshot.a ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {set.scoreSnapshot.b}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">
                          {set.scoreSnapshot.a > set.scoreSnapshot.b ? teamA.name : teamB.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        <div className="flex-shrink-0 border-t border-slate-200 p-4 sm:p-6 dark:border-slate-700">
          <Button onClick={onClose} className="w-full py-3 text-lg">{t(config.language, 'close')}</Button>
        </div>
      </div>
    </div>
  );
};
