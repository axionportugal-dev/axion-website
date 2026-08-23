/**
 * Synthesizes high-fidelity sound effects using standard Web Audio API
 * No external file dependencies - instantly responsive, extremely lightweight.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      // Create new audio context
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended (browser security blocks autoplay initially)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getMuteState(): boolean {
    return this.isMuted;
  }

  // Play a soft high-tech hover sound (micro-feedback)
  playHover() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Cute little digital high chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.1); // E6 note

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }

  // Play an epic, sparkling chime when entering the site
  playEnter() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // We will compose a 3-note sweeping chord (arpeggio) with soft delay/release
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 major chord for positive, open feel
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle'; // triangle has a softer, woodwind-like harmonic structure
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        // Pitch shift upward slightly over time for shimmer effect
        osc.frequency.exponentialRampToValueAtTime(freq * 2, now + idx * 0.08 + 0.6);

        // Slow fade out
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }
}

export const sfx = new SoundEffectsManager();
