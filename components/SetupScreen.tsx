
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
      <div className="relative overflow-hidden px-4 pb-7 pt-6 sm:px-6 sm:pt-8">
        <div className="absolute inset-x-4 top-4 bottom-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.88))] dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.94))] shadow-[0_26px_52px_-40px_rgba(15,23,42,0.82)]" aria-hidden="true" />
        <div className="absolute right-2 top-0 h-40 w-40 rounded-full bg-white/6 blur-3xl" aria-hidden="true" />
        <div className="absolute left-6 bottom-1 h-28 w-28 rounded-full bg-cyan-300/6 blur-2xl" aria-hidden="true" />
        <div className="relative z-10 px-3 pt-6 sm:px-4 sm:pt-7">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="inline-flex max-w-[70%] items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/78 sm:text-[11px] sm:tracking-[0.28em]">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse-soft" aria-hidden="true" />
              {t(config.language, 'matchControl')}
            </div>
            <div className="shrink-0 text-4xl" aria-hidden="true">🏐</div>
          </div>
          <h1 className="font-display text-[clamp(2.3rem,7vw,4.1rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white">
            {t(config.language, 'appTitle')}
          </h1>
          <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-slate-200">
            {t(config.language, 'matchSetupIntro')}
          </p>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-cyan-100/70">
            {t(config.language, 'readyToPlay')}
          </p>
        </div>
      </div>

      {/* Configuration Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6 custom-scrollbar">
        <div className="mx-auto max-w-md">
          <h2 className="mb-6 flex flex-wrap items-center gap-3 text-base font-black uppercase tracking-[0.14em] text-slate-800 dark:text-slate-100 sm:text-lg sm:tracking-[0.16em]">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-white dark:bg-slate-100 dark:text-slate-900">{t(config.language, 'setupBadge')}</span>
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
