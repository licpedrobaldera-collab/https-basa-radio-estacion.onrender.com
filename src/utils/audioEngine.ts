// Web Audio API Dominican Rhythm Synthesizer & Audio Analyzer for BASA V11 ULTRA

class DominicanAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isSequencerRunning = false;
  private timerId: number | null = null;
  private currentStep = 0;
  private bpm = 128;
  private listeners: ((step: number) => void)[] = [];

  // Patterns for 16 steps (4 beats)
  public pattern = {
    kick808: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Classic Dembow syncopation
    guira:   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Continuous rasping guira
    tambora: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0], // Dominican tambora slap
    snare:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], // Dembow snare response
  };

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode {
    const ctx = this.getAudioContext();
    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
    }
    return this.analyser;
  }

  // 1. Dembow 808 Heavy Sub Kick
  public playKick(time?: number) {
    const ctx = this.getAudioContext();
    const t = time ?? ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Deep punchy pitch slide
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(36, t + 0.16);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.getAnalyser());
    this.getAnalyser().connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // 2. Güira Dominicana (Chiki-chiki high metallic scrape)
  public playGuira(time?: number, accent = false) {
    const ctx = this.getAudioContext();
    const t = time ?? ctx.currentTime;

    // Buffer noise
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for metallic sizzle
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, t);

    const gain = ctx.createGain();
    const volume = accent ? 0.45 : 0.22;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.getAnalyser());
    this.getAnalyser().connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.05);
  }

  // 3. Tambora Dominicana (Rimshot slap + low resonance)
  public playTambora(time?: number, highPitch = false) {
    const ctx = this.getAudioContext();
    const t = time ?? ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const startFreq = highPitch ? 280 : 190;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.getAnalyser());
    this.getAnalyser().connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // 4. Snare / Palito de Dembow
  public playSnare(time?: number) {
    const ctx = this.getAudioContext();
    const t = time ?? ctx.currentTime;

    // Tonal body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);
    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.getAnalyser());

    // Noise snap
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.getAnalyser());
    this.getAnalyser().connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
    noise.start(t);
    noise.stop(t + 0.1);
  }

  // Sequencer loop
  public startSequencer(bpm: number, onStep: (step: number) => void) {
    this.bpm = bpm;
    this.listeners = [onStep];
    if (this.isSequencerRunning) return;

    this.isSequencerRunning = true;
    const stepDurationMs = (60 / this.bpm / 4) * 1000;

    const tick = () => {
      if (!this.isSequencerRunning) return;

      const step = this.currentStep;
      if (this.pattern.kick808[step]) this.playKick();
      if (this.pattern.guira[step]) this.playGuira(undefined, step % 4 === 0);
      if (this.pattern.tambora[step]) this.playTambora(undefined, step % 2 === 1);
      if (this.pattern.snare[step]) this.playSnare();

      this.listeners.forEach((fn) => fn(step));
      this.currentStep = (this.currentStep + 1) % 16;

      this.timerId = window.setTimeout(tick, stepDurationMs);
    };

    tick();
  }

  public stopSequencer() {
    this.isSequencerRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentStep = 0;
  }

  public setBpm(newBpm: number) {
    this.bpm = newBpm;
  }

  public isRunning(): boolean {
    return this.isSequencerRunning;
  }

  public setPreset(type: 'dembow' | 'ripiao' | 'mambo' | 'bachata') {
    if (type === 'dembow') {
      this.bpm = 128;
      this.pattern = {
        kick808: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        guira:   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        tambora: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
        snare:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      };
    } else if (type === 'ripiao') {
      this.bpm = 148;
      this.pattern = {
        kick808: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        guira:   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        tambora: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
        snare:   [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
      };
    } else if (type === 'mambo') {
      this.bpm = 138;
      this.pattern = {
        kick808: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        guira:   [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        tambora: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        snare:   [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      };
    } else if (type === 'bachata') {
      this.bpm = 126;
      this.pattern = {
        kick808: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        guira:   [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        tambora: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1], // Bongó simulation
        snare:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      };
    }
  }
}

export const audioEngine = new DominicanAudioEngine();
