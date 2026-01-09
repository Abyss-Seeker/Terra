
import { Mood } from '../types';

/**
 * A generative audio engine that synthesizes ambient music in real-time 
 * based on the current Story Mood.
 */
export class AudioEngine {
  ctx: AudioContext | null;
  masterGain: GainNode | null;
  oscillators: OscillatorNode[];
  gainNodes: GainNode[];
  isPlaying: boolean;

  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.oscillators = [];
    this.gainNodes = [];
    this.isPlaying = false;

    // Support for standard and webkit prefix
    const AudioContextClass = window.AudioContext || 
      (window as any).webkitAudioContext as typeof AudioContext;
    
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      if (this.ctx) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.3; // Master volume
      }
    }
  }

  async start() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.isPlaying = true;
  }

  setMood(mood: string) {
    if (!this.ctx || !this.isPlaying) return;
    
    // Smooth transition: stop old oscillators with fade out, start new ones
    this.stopCurrentNodes();
    
    switch (mood) {
      case Mood.WAKE: // Ethereal, Sine waves
      case Mood.UTOPIA:
        this.createDrone([110, 220, 330], 'sine', 0.1);
        this.createDrone([55], 'sine', 0.2);
        break;
        
      case Mood.CONFLICT: // Harsh, Sawtooth, Dissonant
      case Mood.SCHADENFREUDE:
      case Mood.DYSTOPIA:
        this.createDrone([50, 52, 100], 'sawtooth', 0.08); 
        this.createDrone([40], 'square', 0.1); 
        this.createPulse(4, 400, 'lowpass'); // Fast pulse
        break;
        
      case Mood.PHILOSOPHY: // Hollow, Triangle
      case Mood.NARCISSISM:
        this.createDrone([130.81, 196.00, 261.63], 'triangle', 0.05); 
        this.createDrone([65.41], 'sine', 0.1);
        break;

      case Mood.SANCTUARY: // Choir-like, multiple sines, Perfect Fifths
        this.createDrone([130.81, 196.00, 261.63, 392.00], 'sine', 0.08); // C Major 7
        this.createDrone([65.41], 'sine', 0.15); // Deep Root
        this.createDrone([523.25], 'triangle', 0.02); // High angel
        break;

      case Mood.VOID: // Deep, Rumble, Lowpass noise feel (simulated with detuned squares)
      case Mood.MYOPIC:
      case Mood.ROUTINE: // Repetitive droning
        this.createDrone([30, 30.5], 'square', 0.05); 
        this.createPulse(0.2, 100, 'lowpass'); // Slow heartbeat
        break;
        
      case Mood.HOPE: // Bright, Major, layers
        this.createDrone([146.83, 220.00, 293.66], 'sine', 0.08); // D Major
        this.createDrone([73.42], 'triangle', 0.1);
        this.createPulse(0.5, 800, 'highpass');
        break;
        
      case Mood.END: // Silence / Wind
        this.createDrone([100], 'sine', 0.01); 
        break;
    }
  }

  createDrone(freqs: number[], type: OscillatorType, volume: number) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    freqs.forEach(freq => {
      // Ensure context exists in callback
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      // Slight detune for organic feel
      osc.frequency.value = freq + (Math.random() * 2 - 1); 
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 2); // Fade in
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });
  }

  createPulse(rate: number, filterFreq: number, filterType: BiquadFilterType) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.value = 55; // Base tone for pulse
    
    filter.type = filterType;
    filter.frequency.value = filterFreq;

    gain.gain.value = 0.05;
    
    // LFO effect on gain
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = rate;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.05; // Modulation depth
    
    // Connect LFO to Gain's Gain AudioParam
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start();

    this.oscillators.push(osc, lfo);
    this.gainNodes.push(gain, lfoGain);
  }

  stopCurrentNodes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    this.gainNodes.forEach(node => {
      // Fade out
      try {
        node.gain.cancelScheduledValues(now);
        node.gain.setValueAtTime(node.gain.value, now);
        node.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      } catch (e) { /* ignore */ }
    });

    const oldOscs = [...this.oscillators];
    setTimeout(() => {
        oldOscs.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
    }, 2000);

    this.oscillators = [];
    this.gainNodes = [];
  }
}

export const audioManager = new AudioEngine();
