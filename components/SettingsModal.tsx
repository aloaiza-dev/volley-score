import React from 'react';
import { useRef } from 'react';
import { MatchConfig, TeamState } from '../types';
import { Button } from './Button';
import { t } from '../utils/translations';
import { SettingsContent } from './SettingsContent';
import { useDialogA11y } from '../utils/useDialogA11y';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useDialogA11y(dialogRef, {
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/26 p-4 backdrop-blur-sm dark:bg-slate-950/60 dark:backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div ref={dialogRef} tabIndex={-1} className="flex max-h-[90vh] w-full max-w-md flex-col rounded-[2rem] border border-slate-300/80 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.28)] transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/96 dark:shadow-[0_30px_80px_-36px_rgba(15,23,42,0.8)]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
           <h2 id="settings-title" className="font-display text-2xl font-black uppercase tracking-[0.08em] text-slate-900 dark:text-white">{t(config.language, 'settingsTitle')}</h2>
           <Button ref={closeButtonRef} variant="ghost" size="sm" onClick={onClose} aria-label={t(config.language, 'close')}>✕</Button>
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
