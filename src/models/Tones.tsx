

export class Tone {
    context: AudioContext;
    oscillator: OscillatorNode;
    gainNode: GainNode;
    delay: number = 0.04;
    frequency: number;

    constructor(freq: number, delay: number = 0) {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain();
        this.oscillator = this.context.createOscillator();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.oscillator.type = "sine";
        this.oscillator.frequency.value = freq;
        this.gainNode.gain.value = 0.00001;
        this.oscillator.start();
        this.delay = delay;

    }

    stop(delay: number = this.delay) {
        this.gainNode.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + 0.04);
        this.oscillator.stop(this.context.currentTime + this.delay);
        
    }

    async play(time: number = 10){
        //start oscillator if it has not

        //set gain to one
        this.gainNode.gain.linearRampToValueAtTime(.05, this.context.currentTime +0.01);
        await this.sleep(time);
        this.pause(time);
    }

    private pause(time: number = 10){
        //set gain to zero
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.context.currentTime+ 0.01);
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
