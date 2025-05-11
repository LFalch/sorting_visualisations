class SoundManager {
    constructor(count) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        this.voices = Array.from({ length: count }, () => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            gain.gain.value = 0;

            osc.type = 'sine';
            osc.connect(gain).connect(this.ctx.destination);
            osc.start();

            return {
                enabled: false,
                osc,
                gain
            };
        });
    }

    enable(index)  {
        this.ctx.resume();
        this.voices.forEach(voice => voice.enabled = false);
        this.voices[index].enabled = true;
    }

    disable(index) {
        this.voices[index].enabled = false;
        this.voices[index].gain.gain.setValueAtTime(0, this.ctx.currentTime);
    }

    isEnabled(index) {
        return this.voices[index].enabled;
    }

    playTone(index, freq) {
        const voice = this.voices[index];

        if (!voice.enabled) {
            return;
        }

        const duration = 0.10; // Duration of the sound in seconds.
        const attack = 0.02; // Attack time in seconds.
        const release = 0.02; // Release time in seconds.
        const glide = 0.003; // Glide time in seconds.
        const peakGain = 0.3; // Peak gain value (0.0 to 1.0).

        const t0 = this.ctx.currentTime;

        // Glide from the current frequency to the new one.
        voice.osc.frequency.cancelScheduledValues(t0);
        voice.osc.frequency.setTargetAtTime(freq, t0, glide);

        // Gentle gain envelope.
        const gain = voice.gain.gain;

        if (gain.cancelAndHoldAtTime) {
          // Freeze at the actual current value if supported.
          gain.cancelAndHoldAtTime(t0);
        } else {
          // Otherwise estimate current value and start from there.
          const current = gain.value; // Last explicit value set.
          gain.cancelScheduledValues(t0);
          gain.setValueAtTime(current, t0);
        }

        // Attack
        gain.linearRampToValueAtTime(peakGain, t0 + attack);

        // Hold
        gain.setValueAtTime(peakGain, t0 + attack);
        gain.setValueAtTime(peakGain, t0 + duration - release);

        // Release
        gain.setTargetAtTime(0.0001, t0 + duration - release, release);
    }
}
