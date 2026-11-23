/**
 * Cyber Web Audio synthesizer for futuristic feedback without external assets.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Futuristic blip on hover or click
  playClick() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Success chime on simulation complete or mastery
  playSuccess() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  // Sci-Fi Cyber Security ALARM (Governor Guard Breach)
  playAlarm() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Dual Siren Pulse (wee-woo emergency siren)
      const sirenPulses = [
        { startFreq: 880, endFreq: 460, timeOffset: 0.0, duration: 0.17 },
        { startFreq: 980, endFreq: 520, timeOffset: 0.15, duration: 0.20 },
      ];

      sirenPulses.forEach((pulse) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";

        osc.frequency.setValueAtTime(pulse.startFreq, now + pulse.timeOffset);
        osc.frequency.exponentialRampToValueAtTime(pulse.endFreq, now + pulse.timeOffset + pulse.duration);

        gain.gain.setValueAtTime(0.09, now + pulse.timeOffset);
        gain.gain.linearRampToValueAtTime(0.06, now + pulse.timeOffset + pulse.duration * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + pulse.timeOffset + pulse.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + pulse.timeOffset);
        osc.stop(now + pulse.timeOffset + pulse.duration);
      });

      // 2. Heavy Sub-Bass Lockdown Thud (Industrial security lock punch)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(120, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.28);

      subGain.gain.setValueAtTime(0.14, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.28);
    } catch {
      // Audio fallback
    }
  }

  // Warning buzz when governor limit is breached
  playWarning() {
    this.playAlarm();
  }
}

export const sound = new SoundEngine();

export const playClickSound = () => sound.playClick();
export const playChimeSound = () => sound.playSuccess();
export const playSuccessSound = () => sound.playSuccess();
export const playWarningSound = () => sound.playAlarm();
export const playAlarmSound = () => sound.playAlarm();

