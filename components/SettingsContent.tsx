
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

  const renderTeamSettings = (label: string, team: TeamState, setTeam: (t: TeamState) => void) => (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
      <label className="block text-slate-500 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={team.name}
        onChange={(e) => setTeam({...team, name: e.target.value})}
        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-bold transition-colors"
        placeholder={t(config.language, 'teamName')}
      />
      <div className="flex gap-2 flex-wrap">
        {COLORS.map(c => (
          <button 
            key={c.value}
            onClick={() => setTeam({...team, color: c.value})}
            className={`w-8 h-8 rounded-full shadow-md transition-transform ${c.value} ${team.color === c.value ? 'ring-2 ring-slate-400 dark:ring-white scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
            aria-label={`Select ${c.name}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Teams Section */}
      <div className="space-y-4">
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{t(config.language, 'teams')}</h3>
          {renderTeamSettings(t(config.language, 'team1'), teamA, setTeamA)}
          {renderTeamSettings(t(config.language, 'team2'), teamB, setTeamB)}
      </div>

      {/* Rules Section */}
      <div className="space-y-6">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{t(config.language, 'matchRules')}</h3>
        
          {/* Language Selector */}
          <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">{t(config.language, 'language')}</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange('language', 'en')}
              className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${
                config.language === 'en'
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleChange('language', 'es')}
              className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${
                config.language === 'es'
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Sets to Win */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">{t(config.language, 'matchLength')}</label>
          <div className="flex gap-2">
            {[1, 2, 3].map(sets => (
              <button
                key={sets}
                onClick={() => handleChange('setsToWin', sets)}
                className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${
                  config.setsToWin === sets 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {t(config.language, 'bestOf')} {sets * 2 - 1}
              </button>
            ))}
          </div>
        </div>

        {/* Points per Set */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">{t(config.language, 'pointsPerSet')}</label>
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => handleChange('pointsPerSet', Math.max(5, config.pointsPerSet - 1))}
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >-</button>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{config.pointsPerSet}</span>
            <button 
              onClick={() => handleChange('pointsPerSet', config.pointsPerSet + 1)}
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >+</button>
          </div>
        </div>

        {/* Tie Break Points */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">{t(config.language, 'tieBreakPoints')}</label>
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => handleChange('lastSetPoints', Math.max(5, config.lastSetPoints - 1))}
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >-</button>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{config.lastSetPoints}</span>
            <button 
              onClick={() => handleChange('lastSetPoints', config.lastSetPoints + 1)}
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >+</button>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
          {/* Win by 2 Toggle */}
          <div className="flex items-center justify-between py-2">
            <label className="text-slate-700 dark:text-slate-300 font-medium">{t(config.language, 'winByTwo')}</label>
            <button 
              onClick={() => handleChange('winByTwo', !config.winByTwo)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${config.winByTwo ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config.winByTwo ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between py-2">
            <label className="text-slate-700 dark:text-slate-300 font-medium">{t(config.language, 'soundEffects')}</label>
            <button 
              onClick={() => handleChange('enableSound', !config.enableSound)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${config.enableSound ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config.enableSound ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* AI Summary Toggle */}
          <div className="flex items-center justify-between py-2">
            <label className="text-slate-700 dark:text-slate-300 font-medium">{t(config.language, 'aiRecap')}</label>
            <button 
              onClick={() => handleChange('enableAI', !config.enableAI)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${config.enableAI ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config.enableAI ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2">
            <label className="text-slate-700 dark:text-slate-300 font-medium">{t(config.language, 'darkMode')}</label>
            <button 
              onClick={() => handleChange('isDarkMode', !config.isDarkMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${config.isDarkMode ? 'bg-slate-900' : 'bg-slate-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config.isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
