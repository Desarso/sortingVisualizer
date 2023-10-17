export class Tone {
  context: AudioContext;
  oscillator: OscillatorNode;
  gainNode: GainNode;
  delay: number = 0.04;
  frequency: number = 300;
  intialized: boolean = false;

  constructor(freq: number, delay: number = 0) {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.oscillator = this.context.createOscillator();
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.oscillator.type = "sine";
    this.oscillator.frequency.value = freq;
    // this.gainNode.gain.value = 0.00001;
    this.delay = delay;
  }

  stop() {
    this.gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      this.context.currentTime + 0.04
    );
    this.oscillator.stop(this.context.currentTime + this.delay);
  }

  async start() {
    if (this.intialized) return;
    this.intialized = true;
    this.oscillator.start(this.context.currentTime + this.delay);
  }

  async play(freq: number = this.frequency, delay: number = 10) {
    await this.start();
    this.oscillator.frequency.value = freq;
    this.gainNode.gain.linearRampToValueAtTime(
      4,
      this.context.currentTime + 0.04
    );

    await this.sleep(delay);
    this.pause();
  }

  private pause() {
    //set gain to zero
    this.gainNode.gain.linearRampToValueAtTime(
      0.00001,
      this.context.currentTime + 0.13
    );
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
