/**
 * @file src/services/soundEffects.ts
 * @responsibility Single Responsibility: Synthesize realistic emergency audio cues,
 * collision countdown sirens, and confirmation chimes using the HTML5 Web Audio API.
 */

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private sirenInterval: number | null = null;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Play high-pitched urgent beep for the 10-second countdown tick
   */
  public playCountdownTick(remainingSec: number) {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch increases as remaining seconds drop
      const baseFreq = 880 + (10 - remainingSec) * 60;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.18);
    } catch {
      // Graceful fallback if audio context not permitted yet
    }
  }

  /**
   * Play loud two-tone emergency siren during active accident event
   */
  public startEmergencySiren() {
    this.stopEmergencySiren();
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      let high = false;
      const playTone = () => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(high ? 960 : 640, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);
        high = !high;
      };

      playTone();
      this.sirenInterval = window.setInterval(playTone, 400);
    } catch {
      // Audio autoplay restrictions safety
    }
  }

  public stopEmergencySiren() {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }

  /**
   * Play safe disarm chime when user cancels the false alarm
   */
  public playSafeDisarmChime() {
    this.stopEmergencySiren();
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + idx * 0.08);
        osc.stop(this.audioCtx.currentTime + idx * 0.08 + 0.25);
      });
    } catch {
      // Audio fail safety
    }
  }

  /**
   * Play standard telephone ringing tone simulation for priority contacts
   */
  public playRingingTone() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, this.audioCtx.currentTime); // Standard ringback
      osc2.frequency.setValueAtTime(480, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.audioCtx.currentTime + 1.4);
      osc2.stop(this.audioCtx.currentTime + 1.4);
    } catch {
      // Safety
    }
  }
}

export const soundEffects = new SoundEffectsService();
