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
     * Premium crystal chime transition for onboarding steps.
     * Three-note ascending arpeggio with harmonic overtones.
     */
    playTransition() {
        const ctx = this.getContext();
        if (!ctx) return;

        if (typeof window !== "undefined") {
            const enabled = window.localStorage.getItem("opendraft_sounds");
            if (enabled === "false") return;
        }

        // Helper: play a rich note with fundamental + subtle harmonic
        const playNote = (freq: number, delay: number, vol: number, dur: number) => {
            setTimeout(() => {
                // Fundamental
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = "sine";
                osc1.frequency.setValueAtTime(freq, ctx.currentTime);
                osc1.frequency.exponentialRampToValueAtTime(freq * 1.002, ctx.currentTime + dur); // micro detune for warmth
                gain1.gain.setValueAtTime(0, ctx.currentTime);
                gain1.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.008);
                gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start();
                osc1.stop(ctx.currentTime + dur);

                // Octave harmonic (very subtle shimmer)
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = "sine";
                osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);
                gain2.gain.setValueAtTime(0, ctx.currentTime);
                gain2.gain.linearRampToValueAtTime(vol * 0.25, ctx.currentTime + 0.006);
                gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur * 0.6);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start();
                osc2.stop(ctx.currentTime + dur);
            }, delay);
        };

        // Ascending A4 → C#5 → E5 arpeggio
        playNote(440.00, 0, 0.038, 0.35); // A4
        playNote(554.37, 65, 0.032, 0.32); // C#5
        playNote(659.25, 130, 0.026, 0.40); // E5
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
