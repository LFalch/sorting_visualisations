class SoundManager {
    constructor(count) {
        this.enabled = new Array(count).fill(false);
        this.audioCtxs = new Array(count).fill(null);
    }
    enable(index) {
        this.enabled.fill(false);
        this.enabled[index] = true;
        if (!this.audioCtxs[index]) {
            this.audioCtxs[index] = new (window.AudioContext||window.webkitAudioContext)();
        }
    }
    disable(index) {
        this.enabled[index] = false;
        if (this.audioCtxs[index]) {
            this.audioCtxs[index].close();
            this.audioCtxs[index] = null;
        }
    }
    isEnabled(index) {
        return this.enabled[index];
    }
    playTone(index, freq) {
        if (!this.isEnabled(index)) {
            return;
        }

        const ctx = this.audioCtxs[index];
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        const duration = 0.1;
        const fadeTime = 0.01;
        gainNode.gain.cancelScheduledValues(now);

        const maxGain = 0.3;

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(maxGain, now + fadeTime);
        
        osc.start(now);
        gainNode.gain.linearRampToValueAtTime(0, now + duration - fadeTime);
        osc.stop(now + duration);
        osc.onended = () => { osc.disconnect(); gainNode.disconnect(); };
    }
}

