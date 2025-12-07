let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0) => {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    // Smooth envelope to avoid clicking
    gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export const playPointSound = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
  
  // A simple, short "pop" sound
  playTone(600, 'sine', 0.1);
};

export const playSetWinSound = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  // A generic "success" ascending major third
  playTone(523.25, 'sine', 0.2, 0);    // C5
  playTone(659.25, 'sine', 0.4, 0.15); // E5
};

export const playMatchWinSound = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  // A major arpeggio fanfare
  playTone(523.25, 'triangle', 0.2, 0);    // C5
  playTone(659.25, 'triangle', 0.2, 0.15); // E5
  playTone(783.99, 'triangle', 0.2, 0.30); // G5
  playTone(1046.50, 'triangle', 0.8, 0.45); // C6
};