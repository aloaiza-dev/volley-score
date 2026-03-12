
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
    <div className="flex flex-col h-full bg-transparent transition-colors duration-300">
      <div className="px-4 pt-5 pb-3 sm:px-6 sm:pt-6">
        <div className="mx-auto flex max-w-md items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-2xl leading-none" aria-hidden="true">🏐</div>
              <h1 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl">
                {t(config.language, 'appTitle')}
              </h1>
            </div>
            <p className="mt-2 max-w-sm text-sm font-medium leading-5 text-slate-600 dark:text-slate-300">
              {t(config.language, 'matchSetupIntro')}
            </p>
          </div>
          <div className="mt-1 shrink-0 rounded-full bg-emerald-500/12 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            {t(config.language, 'setupBadge')}
          </div>
        </div>
      </div>

      {/* Configuration Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6 custom-scrollbar">
        <div className="mx-auto max-w-md">
          <h2 className="mb-5 text-base font-black uppercase tracking-[0.14em] text-slate-800 dark:text-slate-100 sm:text-lg sm:tracking-[0.16em]">
            {t(config.language, 'configureTeams')}
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
      <div className="z-20 border-t border-slate-200/70 bg-white/84 p-4 shadow-[0_-14px_30px_-28px_rgba(15,23,42,0.34)] dark:border-slate-800 dark:bg-slate-900/86 sm:p-6">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={onStartMatch} 
            variant="primary" 
            size="xl" 
            className="w-full text-2xl py-5 font-display uppercase"
          >
            {t(config.language, 'startMatch')} 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};
