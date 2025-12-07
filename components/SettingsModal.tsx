
import React from 'react';
import { MatchConfig, TeamState } from '../types';
import { Button } from './Button';
import { t } from '../utils/translations';
import { SettingsContent } from './SettingsContent';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MatchConfig;
  onUpdateConfig: (newConfig: MatchConfig) => void;
  teamA: TeamState;
  setTeamA: (team: TeamState) => void;
  teamB: TeamState;
  setTeamB: (team: TeamState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  onUpdateConfig,
  teamA,
  setTeamA,
  teamB,
  setTeamB
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh] transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 flex justify-between items-center">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t(config.language, 'settingsTitle')}</h2>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <SettingsContent 
            config={config}
            onUpdateConfig={onUpdateConfig}
            teamA={teamA}
            setTeamA={setTeamA}
            teamB={teamB}
            setTeamB={setTeamB}
          />
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <Button onClick={onClose} className="w-full py-4 text-lg shadow-xl">{t(config.language, 'done')}</Button>
        </div>
      </div>
    </div>
  );
};
