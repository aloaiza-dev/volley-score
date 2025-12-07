
import React, { useEffect, useState } from 'react';
import { generateMatchSummary } from '../services/geminiService';
import { TeamState, HistoryEvent, MatchConfig } from '../types';
import { Button } from './Button';
import { t } from '../utils/translations';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamA: TeamState;
  teamB: TeamState;
  history: HistoryEvent[];
  isMatchOver: boolean;
  config: MatchConfig;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ 
  isOpen, onClose, teamA, teamB, history, isMatchOver, config
}) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && history.length > 0) {
      setLoading(true);
      generateMatchSummary(teamA, teamB, history, isMatchOver, config.language)
        .then(setSummary)
        .finally(() => setLoading(false));
    }
  }, [isOpen, teamA, teamB, history, isMatchOver, config.language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[80vh] flex flex-col transition-colors duration-300">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          ✨ {t(config.language, 'matchInsight')}
        </h2>
        
        <div className="flex-1 overflow-y-auto mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">{t(config.language, 'analyzing')}</p>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-slate-700 dark:text-slate-200 leading-relaxed text-lg">
                {summary}
              </p>
            </div>
          )}
        </div>

        <Button onClick={onClose} className="w-full">{t(config.language, 'close')}</Button>
      </div>
    </div>
  );
};
