
import React, { useMemo } from 'react';
import { TeamState, HistoryEvent, MatchConfig } from '../types';
import { Button } from './Button';
import { t } from '../utils/translations';

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

  if (!isOpen) return null;

  // Helper for percentage bar
  const getPercent = (val: number, total: number) => {
    if (total === 0) return 50;
    return Math.round((val / total) * 100);
  };

  const pctA = getPercent(stats.totalPointsA, stats.totalPoints);
  const pctB = getPercent(stats.totalPointsB, stats.totalPoints);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh] transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             📊 {t(config.language, 'matchStats')}
           </h2>
           <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Total Points Visualization */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t(config.language, 'totalPoints')}</h3>
            <div className="flex items-end justify-between text-2xl font-black mb-1">
               <span style={{ color: teamA.color.replace('bg-', 'text-').replace('-600', '-500') }} className="text-blue-500">{stats.totalPointsA}</span>
               <span style={{ color: teamB.color.replace('bg-', 'text-').replace('-600', '-500') }} className="text-red-500">{stats.totalPointsB}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div style={{ width: `${pctA}%` }} className={`${teamA.color} transition-all duration-500`} />
              <div style={{ width: `${pctB}%` }} className={`${teamB.color} transition-all duration-500`} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              <span>{teamA.name} ({pctA}%)</span>
              <span>{teamB.name} ({pctB}%)</span>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
               <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">{t(config.language, 'setsWon')}</div>
               <div className="flex justify-between items-center">
                 <div className="font-bold text-slate-900 dark:text-white">{teamA.name}</div>
                 <div className="text-2xl font-black text-slate-900 dark:text-white">{teamA.setsWon}</div>
               </div>
               <div className="flex justify-between items-center mt-1">
                 <div className="font-bold text-slate-900 dark:text-white">{teamB.name}</div>
                 <div className="text-2xl font-black text-slate-900 dark:text-white">{teamB.setsWon}</div>
               </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
               <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">{t(config.language, 'longestStreak')}</div>
               <div className="flex justify-between items-center">
                 <div className="font-bold text-slate-900 dark:text-white truncate pr-2">{teamA.name}</div>
                 <div className="text-xl font-black text-blue-500">{stats.maxStreakA}</div>
               </div>
               <div className="flex justify-between items-center mt-1">
                 <div className="font-bold text-slate-900 dark:text-white truncate pr-2">{teamB.name}</div>
                 <div className="text-xl font-black text-red-500">{stats.maxStreakB}</div>
               </div>
            </div>
          </div>

          {/* Detailed Set History Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">{t(config.language, 'setHistory')}</h3>
            {stats.setHistory.length === 0 ? (
               <div className="text-center py-6 text-slate-400 dark:text-slate-500 italic">{t(config.language, 'noSets')}</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="px-4 py-3">{t(config.language, 'set')}</th>
                      <th className="px-4 py-3">{teamA.name}</th>
                      <th className="px-4 py-3">{teamB.name}</th>
                      <th className="px-4 py-3 text-right">{t(config.language, 'winner')}</th>
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

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <Button onClick={onClose} className="w-full py-3 text-lg">{t(config.language, 'close')}</Button>
        </div>
      </div>
    </div>
  );
};
