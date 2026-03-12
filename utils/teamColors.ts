export interface TeamColorToken {
  swatch: string;
  highlight: string;
  tint: string;
  border: string;
  text: string;
  glow: string;
}

const TEAM_COLORS: Record<string, TeamColorToken> = {
  'bg-blue-600': {
    swatch: '#2563eb',
    highlight: '#93c5fd',
    tint: 'rgba(37, 99, 235, 0.12)',
    border: 'rgba(37, 99, 235, 0.32)',
    text: '#1d4ed8',
    glow: 'rgba(37, 99, 235, 0.22)',
  },
  'bg-red-600': {
    swatch: '#dc2626',
    highlight: '#fca5a5',
    tint: 'rgba(220, 38, 38, 0.12)',
    border: 'rgba(220, 38, 38, 0.32)',
    text: '#b91c1c',
    glow: 'rgba(220, 38, 38, 0.22)',
  },
  'bg-emerald-600': {
    swatch: '#059669',
    highlight: '#6ee7b7',
    tint: 'rgba(5, 150, 105, 0.18)',
    border: 'rgba(5, 150, 105, 0.32)',
    text: '#047857',
    glow: 'rgba(5, 150, 105, 0.22)',
  },
  'bg-orange-600': {
    swatch: '#ea580c',
    highlight: '#fdba74',
    tint: 'rgba(234, 88, 12, 0.2)',
    border: 'rgba(234, 88, 12, 0.32)',
    text: '#c2410c',
    glow: 'rgba(234, 88, 12, 0.22)',
  },
  'bg-purple-600': {
    swatch: '#9333ea',
    highlight: '#d8b4fe',
    tint: 'rgba(147, 51, 234, 0.18)',
    border: 'rgba(147, 51, 234, 0.32)',
    text: '#7e22ce',
    glow: 'rgba(147, 51, 234, 0.22)',
  },
  'bg-pink-600': {
    swatch: '#db2777',
    highlight: '#f9a8d4',
    tint: 'rgba(219, 39, 119, 0.18)',
    border: 'rgba(219, 39, 119, 0.32)',
    text: '#be185d',
    glow: 'rgba(219, 39, 119, 0.22)',
  },
  'bg-teal-600': {
    swatch: '#0d9488',
    highlight: '#99f6e4',
    tint: 'rgba(13, 148, 136, 0.18)',
    border: 'rgba(13, 148, 136, 0.32)',
    text: '#0f766e',
    glow: 'rgba(13, 148, 136, 0.22)',
  },
  'bg-slate-700': {
    swatch: '#334155',
    highlight: '#cbd5e1',
    tint: 'rgba(51, 65, 85, 0.2)',
    border: 'rgba(51, 65, 85, 0.34)',
    text: '#334155',
    glow: 'rgba(51, 65, 85, 0.18)',
  },
};

export const getTeamColorToken = (colorClass: string): TeamColorToken => {
  return TEAM_COLORS[colorClass] || TEAM_COLORS['bg-blue-600'];
};
