var music = new Audio();

/*
var context = new AudioContext()
var audioSource = context.createMediaElementSource(music)
var filter = context.createBiquadFilter()
filter.connect(context.destination)
filter.type = "lowshelf";
filter.frequency.value = 1000;
*/

/*
  Note that "native" method only works in Firefox
*/
let neiros_native = {
    "1": {
        method: "native",
        src: "1.mp3"
    },
    "2": {
        method: "native",
        src: "2.mp3"
    }
}

/*
  Note that "tone" method requires a fresh Tone.js instance
*/
let neiros_tonejs = {
    "1": function () {
        return {
            method: "tone",
            obj: new Tone.PolySynth(1, Tone.Synth).chain(new Tone.Tremolo().start(), Tone.Master)
        }
    }
}

let chords = {
    "1": [1, 3, 7, 8, 11, 13]
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

let musics = {
    random_notes: function(neiro, tempo = 200) {
        setInterval(function () {
            let tone = Math.random() * 12 - 6
            play(neiro, tone, 100)
        }, tempo)
    },
    choice_notes: function(neiro, arr, tempo = 200) {
        setInterval(function () {
            let tone = choice(arr)
            play(neiro, tone, 100)
        }, tempo)
    },
    random_walk_1: function(neiro, arr, tempo = 200, walks = [-1, 0, 1]) {
        let current_pos = 0
        setInterval(function () {
            let move = choice(walks)
            current_pos += move
            let tone = arr[mod(current_pos, arr.length)] + Math.floor(current_pos/12)*12
            console.log(tone)
            play(neiro, tone, 100)
        }, tempo)
    },
    random_walk_2: function(neiro, arr, tempo = 200, walks = [-1, 0, 1]) {
        let current_pos = 0
        setInterval(function () {
            let move = choice(walks)
            current_pos += move
            let tone = arr[mod(current_pos, arr.length)] + Math.floor(current_pos/arr.length)*12
            console.log(tone)
            play(neiro, tone, 100)
        }, tempo)
    },
    random_walk_3: function(neiro, arr, tempo = 200, walks = [-1, 0, 1]) {
        let current_pos = 0
        setInterval(function () {
            let move = choice(walks)
            current_pos += move
            let tone = arr[mod(current_pos, arr.length)] + Math.floor(current_pos/arr.length)*12
            console.log(tone)
            play(neiro, tone, 100)
        }, tempo)
    }
}

function choice(x) {
    return x[Math.floor(x.length * Math.random())]
}

function mod(n, m) {
    return ((n % m) + m) % m
}

function start() {
    musics.random_walk_3(neiros_tonejs["1"](), chords["1"])
}

let startRan = false;
document.addEventListener("click", function () {
    //if (!startRan) {
        start()
        startRan = true
    //}
})