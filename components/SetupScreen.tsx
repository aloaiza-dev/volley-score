
import React from 'react';
import { MatchConfig, TeamState } from '../types';
import { Button } from './Button';
import { t } from '../utils/translations';
import { SettingsContent } from './SettingsContent';

interface SetupScreenProps {
  config: MatchConfig;
  onUpdateConfig: (newConfig: MatchConfig) => void;
  teamA: TeamState;
  setTeamA: (team: TeamState) => void;
  teamB: TeamState;
  setTeamB: (team: TeamState) => void;
  onStartMatch: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  config,
  onUpdateConfig,
  teamA,
  setTeamA,
  teamB,
  setTeamB,
  onStartMatch
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Hero Header */}
      <div className="px-6 pt-12 pb-8 bg-white dark:bg-slate-800 shadow-sm z-10">
        <div className="flex justify-center mb-4">
           <div className="text-6xl">🏐</div>
        </div>
        <h1 className="text-4xl font-black text-center text-slate-900 dark:text-white mb-2 tracking-tight">
          {t(config.language, 'appTitle')}
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
          {t(config.language, 'readyToPlay')}
        </p>
      </div>

      {/* Configuration Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            ⚙️ {t(config.language, 'configureTeams')}
          </h2>
          
          <SettingsContent 
            config={config}
            onUpdateConfig={onUpdateConfig}
            teamA={teamA}
            setTeamA={setTeamA}
            teamB={teamB}
            setTeamB={setTeamB}
          />
        </div>
      </div>

      {/* Start Button Footer */}
      <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={onStartMatch} 
            variant="primary" 
            size="xl" 
            className="w-full shadow-blue-500/30 text-2xl py-5"
          >
            {t(config.language, 'startMatch')} 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};
