var music = new Audio();

/*
var context = new AudioContext()
var audioSource = context.createMediaElementSource(music)
var filter = context.createBiquadFilter()
filter.connect(context.destination)
filter.type = "lowshelf";
filter.frequency.value = 1000;
*/

var neiros = {
    "n1": {
        method: "native",
        src: "1.mp3"
    },
    "n2": {
        method: "native",
        src: "2.mp3"
    },
    "t1": {
        method: "tone",
        obj: new Tone.PolySynth(1, Tone.Synth).chain(new Tone.Tremolo().start(), Tone.Master)
    }
}

function play(neiro, pitch, duration) {
    if (neiro.method === "native") {
        music.preload = "auto";
        music.src = neiro.src;
        music.load();
        music.mozPreservesPitch = false
        music.webkitPreservesPitch = false
        music.playbackRate = Math.pow(2, pitch / 12)

        music.loop = true;
        music.play();

        setTimeout(function () {
            music.pause()
        }, duration)
    } else if (neiro.method === "tone") {
        let num = [440 * Math.pow(2, pitch / 12)]
        neiro.obj.triggerAttack(num)
        setTimeout(function () {
            neiro.obj.triggerRelease(num)
        }, duration)
    }
}

function start() {
    play(neiros["t1"], 0, 100)
}

let startRan = false;
document.addEventListener("click", function () {
    //if (!startRan) {
        start()
        startRan = true
    //}
})