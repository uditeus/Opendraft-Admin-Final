/**
 * Premium sound effects system for Opendraft.
 * Uses procedural synthesis via AudioContext for low latency and consistent "high-end" feel.
 */

class SoundSystem {
    private ctx: AudioContext | null = null;

    private getContext(): AudioContext | null {
        if (typeof window === "undefined") return null;
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        return this.ctx;
    }

    private playProcedural(
        options: {
            freq?: number;
            type?: OscillatorType;
            duration?: number;
            volume?: number;
            attack?: number;
            decay?: number;
            pitchSweep?: number;
        }
    ) {
        // Check if sounds are disabled in localStorage
        if (typeof window !== "undefined") {
            const enabled = window.localStorage.getItem("opendraft_sounds");
            if (enabled === "false") return;
        }

        const ctx = this.getContext();
        if (!ctx) return;

        const {
            freq = 440,
            type = "sine",
            duration = 0.2,
            volume = 0.1,
            attack = 0.01,
            decay = 0.1,
            pitchSweep = 0
        } = options;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        if (pitchSweep !== 0) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq + pitchSweep), ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    /**
     * Premium "double blip" for starting interactions.
     */
    playStart() {
        const ctx = this.getContext();
        if (!ctx) return;

        // First blip (B5)
        this.playProcedural({ freq: 987.77, duration: 0.12, volume: 0.04, attack: 0.01 });

        // Second blip (E6) slightly offset
        setTimeout(() => {
            this.playProcedural({ freq: 1318.51, duration: 0.15, volume: 0.03, attack: 0.01 });
        }, 50);
    }

    /**
     * Soft descending "zen" blip for ending interactions.
     */
    playEnd() {
        this.playProcedural({
            freq: 392.00, // G4
            duration: 0.3,
            volume: 0.04,
            pitchSweep: -196, // Slide to G3
            type: "sine"
        });
    }

    /**
     * Subtle bubble-pop for sending messages.
     */
    playSent() {
        this.playProcedural({
            freq: 600,
            duration: 0.1,
            volume: 0.05,
            pitchSweep: 200, // Quick upward sweep
            type: "sine"
        });
    }

    /**
     * Delicate notification for incoming responses.
     */
    playReceived() {
        this.playProcedural({ freq: 880, duration: 0.1, volume: 0.03 });
        setTimeout(() => {
            this.playProcedural({ freq: 1108.73, duration: 0.15, volume: 0.02 });
        }, 80);
    }

    /**
     * Clean transition sound for navigation.
     */
    playTransition() {
        this.playProcedural({
            freq: 220,
            duration: 0.4,
            volume: 0.02,
            pitchSweep: 110,
            type: "sine"
        });
    }

    /**
   * Positive success sound (ascending triad).
   */
    playSuccess() {
        this.playProcedural({ freq: 523.25, duration: 0.1, volume: 0.03 }); // C5
        setTimeout(() => {
            this.playProcedural({ freq: 659.25, duration: 0.1, volume: 0.03 }); // E5
        }, 60);
        setTimeout(() => {
            this.playProcedural({ freq: 783.99, duration: 0.15, volume: 0.03 }); // G5
        }, 120);
    }

}

export const sounds = new SoundSystem();
