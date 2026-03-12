import React from 'react';
import { MatchConfig, TeamState } from '../types';
import { t } from '../utils/translations';

interface SettingsContentProps {
  config: MatchConfig;
  onUpdateConfig: (newConfig: MatchConfig) => void;
  teamA: TeamState;
  setTeamA: (team: TeamState) => void;
  teamB: TeamState;
  setTeamB: (team: TeamState) => void;
}

const COLORS = [
  { name: 'Blue', value: 'bg-blue-600' },
  { name: 'Red', value: 'bg-red-600' },
  { name: 'Green', value: 'bg-emerald-600' },
  { name: 'Orange', value: 'bg-orange-600' },
  { name: 'Purple', value: 'bg-purple-600' },
  { name: 'Pink', value: 'bg-pink-600' },
  { name: 'Teal', value: 'bg-teal-600' },
  { name: 'Gray', value: 'bg-slate-700' },
];

export const SettingsContent: React.FC<SettingsContentProps> = ({
  config,
  onUpdateConfig,
  teamA,
  setTeamA,
  teamB,
  setTeamB
}) => {

  const handleChange = (key: keyof MatchConfig, value: number | boolean | string) => {
    onUpdateConfig({ ...config, [key]: value });
  };

  const renderTeamSettings = (label: string, team: TeamState, setTeam: (t: TeamState) => void, idPrefix: string) => (
    <div className="space-y-4 rounded-[1.6rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.55)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
      <label htmlFor={`${idPrefix}-name`} className="block text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-[0.24em]">{label}</label>
      <input 
        id={`${idPrefix}-name`}
        type="text" 
        value={team.name}
        onChange={(e) => setTeam({...team, name: e.target.value})}
        maxLength={40}
        className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-slate-50/90 px-4 py-3.5 text-lg font-extrabold text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-500 dark:bg-slate-800 dark:text-white"
        placeholder={t(config.language, 'teamName')}
      />
      <div className="flex gap-2 flex-wrap" role="group" aria-label={`${t(config.language, 'chooseColorFor')} ${team.name}`}>
        {COLORS.map(c => (
          <button 
            type="button"
            key={c.value}
            onClick={() => setTeam({...team, color: c.value})}
            className={`h-11 w-11 rounded-full border-2 border-white shadow-md transition-transform ${c.value} ${team.color === c.value ? 'ring-4 ring-slate-300 dark:ring-slate-500 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
            aria-label={`${t(config.language, 'selectColor')} ${c.name}`}
            aria-pressed={team.color === c.value}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Teams Section */}
      <div className="space-y-4">
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">{t(config.language, 'teams')}</h3>
          {renderTeamSettings(t(config.language, 'team1'), teamA, setTeamA, 'team1')}
          {renderTeamSettings(t(config.language, 'team2'), teamB, setTeamB, 'team2')}
      </div>

      {/* Rules Section */}
      <div className="space-y-6">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">{t(config.language, 'matchRules')}</h3>
        
          {/* Language Selector */}
          <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">{t(config.language, 'language')}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleChange('language', 'en')}
              className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${
                config.language === 'en'
                  ? 'bg-slate-950 border-slate-950 text-white dark:bg-white dark:border-white dark:text-slate-950' 
                  : 'bg-white/80 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleChange('language', 'es')}
              className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${
                config.language === 'es'
                  ? 'bg-slate-950 border-slate-950 text-white dark:bg-white dark:border-white dark:text-slate-950' 
                  : 'bg-white/80 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Sets to Win */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">{t(config.language, 'matchLength')}</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[1, 2, 3].map(sets => (
              <button
                type="button"
                key={sets}
                onClick={() => handleChange('setsToWin', sets)}
                className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${
                  config.setsToWin === sets 
                    ? 'bg-slate-950 border-slate-950 text-white dark:bg-white dark:border-white dark:text-slate-950' 
                    : 'bg-white/80 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {t(config.language, 'bestOf')} {sets * 2 - 1}
              </button>
            ))}
          </div>
        </div>

        {/* Points per Set */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">{t(config.language, 'pointsPerSet')}</label>
          <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200 bg-white/80 p-2 dark:border-slate-700 dark:bg-slate-900">
            <button 
              type="button"
              onClick={() => handleChange('pointsPerSet', Math.max(5, config.pointsPerSet - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-xl font-black text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              aria-label={t(config.language, 'decreasePointsPerSet')}
            >-</button>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{config.pointsPerSet}</span>
            <button 
              type="button"
              onClick={() => handleChange('pointsPerSet', config.pointsPerSet + 1)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-xl font-black text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              aria-label={t(config.language, 'increasePointsPerSet')}
            >+</button>
          </div>
        </div>

        {/* Tie Break Points */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">{t(config.language, 'tieBreakPoints')}</label>
          <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200 bg-white/80 p-2 dark:border-slate-700 dark:bg-slate-900">
            <button 
              type="button"
              onClick={() => handleChange('lastSetPoints', Math.max(5, config.lastSetPoints - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-xl font-black text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              aria-label={t(config.language, 'decreaseFinalSetPoints')}
            >-</button>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{config.lastSetPoints}</span>
            <button 
              type="button"
              onClick={() => handleChange('lastSetPoints', config.lastSetPoints + 1)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-xl font-black text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              aria-label={t(config.language, 'increaseFinalSetPoints')}
            >+</button>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
          {/* Win by 2 Toggle */}
          <div className="flex items-center justify-between gap-4 py-2">
            <label className="text-slate-700 dark:text-slate-300 font-medium">{t(config.language, 'winByTwo')}</label>
            <button 
              type="button"
              onClick={() => handleChange('winByTwo', !config.winByTwo)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${config.winByTwo ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              role="switch"
              aria-checked={config.winByTwo}
              aria-label={t(config.language, 'winByTwo')}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config.winByTwo ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between gap-4 py-2">
            <label className="text-slate-700 dark:text-slate-300 font-medium">{t(config.language, 'soundEffects')}</label>
            <button 
              type="button"
              onClick={() => handleChange('enableSound', !config.enableSound)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${config.enableSound ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              role="switch"
              aria-checked={config.enableSound}
              aria-label={t(config.language, 'soundEffects')}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config.enableSound ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between gap-4 py-2">
            <label className="text-slate-700 dark:text-slate-300 font-medium">{t(config.language, 'darkMode')}</label>
            <button 
              type="button"
              onClick={() => handleChange('isDarkMode', !config.isDarkMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${config.isDarkMode ? 'bg-slate-900' : 'bg-slate-300'}`}
              role="switch"
              aria-checked={config.isDarkMode}
              aria-label={t(config.language, 'darkMode')}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config.isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
