
import wack from "../tunes/pop.ogg";

const audioContext = new (window.AudioContext)();


function loadAudioFile(url: any, tone = 100) {
    if(tone > Wack.maxTone){
        tone = Wack.maxTone;
    }
    if(tone < Wack.minTone){
        tone = Wack.minTone;
    }
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';


    request.onload = function() {
        const audioData = request.response;
        audioContext.decodeAudioData(audioData, function(buffer) {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;

            const gainNode = audioContext.createGain();
            source.connect(gainNode);
            gainNode.gain.value = 0.3;
            source.playbackRate.value = tone / 100;
            gainNode.connect(audioContext.destination);

            source.start();
        }, function(error) {
            console.error('decodeAudioData error', error);
        });
    };

    request.onerror = function(event) {
        console.error('loadAudioFile error', event);
    
    }

    request.send();
}


let id = 0;

export class Wack{

    id : any;
    static lastTimePlayed : any = 0;
    static maxTone = 250;
    static minTone = 50;

    static playSound(tone = 100){
        if(Date.now() - Wack.lastTimePlayed < 10){
            return;
        }
        Wack.lastTimePlayed = Date.now();
        loadAudioFile(wack, tone);
        

    }

    static loopSound(ms = 1000, tone = 100){

        id = setInterval(() => {
            Wack.playSound(tone);
        }, ms);

    }

    //stop loop sound
    static stopLoopSound(){
        clearInterval(id);
    }

    async sleep(ms: any) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}