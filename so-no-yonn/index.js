/*
var context = new AudioContext()
var audioSource = context.createMediaElementSource(music)
var filter = context.createBiquadFilter()
filter.connect(context.destination)
filter.type = "lowshelf";
filter.frequency.value = 1000;
*/

/*
    note that "native" presets only work on Firefox
 */
let neiros = {
    "n1": function () {
        return {
            method: "native",
            src: "1.mp3",
            audio: new Audio()
        }
    },
    "n2": function () {
        return {
            method: "native",
            src: "2.mp3",
            audio: new Audio()
        }
    },
    "t1": function () {
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
        let audio = neiro.audio
        audio.preload = "auto";
        audio.src = neiro.src;
        audio.load();
        audio.preservespitch = false
        audio.preservesPitch = false
        audio.mozPreservesPitch = false
        audio.webkitPreservesPitch = false
        audio.playbackRate = Math.pow(2, pitch / 12)

        audio.loop = true;
        audio.play();

        setTimeout(function () {
            audio.pause()
        }, duration)
    } else if (neiro.method === "tone") {
        let num = [440 * Math.pow(2, pitch / 12)]
        neiro.obj.triggerAttack(num)
        setTimeout(function () {
            neiro.obj.triggerRelease(num)
        }, duration)
    }
}

let tracks = {
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
    random_walk_3: function(neiro, arr, tempo = 200, errors = [-1, 1], error_rate = 0.1, walks = [-1, 0, 1]) {
        let current_pos = 0
        setInterval(function () {
            let move = choice(walks)
            current_pos += move
            let tone = arr[mod(current_pos, arr.length)] + Math.floor(current_pos/arr.length)*12
            if (Math.random() < error_rate) {
                tone += choice(errors)
            }
            play(neiro, tone, 100)
        }, tempo)
    },
    from_function: function (neiro, func, tempo = 200, offset = -5) {
        let count_frame = 0
        let count_func = 0
        let length = 0
        let args, tone
        setInterval(function () {
            if (count_frame === length) {
                count_frame = 0
                args = func(count_func) // args == [tone, length]
                tone = args[0]
                length = args[1]
                play(neiro, tone, tempo*length + offset)
                count_func++
            }
            count_frame++
        }, tempo)
    }
}

let musics = {
    "so-no-1": function () {
        tracks.random_walk_2(neiros["t1"](), chords["1"], 200, [-2, -1, 0, 1, 2])
        tracks.random_walk_2(neiros["t1"](), chords["1"], 200, [-1, 0, 1])
    },
    "so-no-2": function () {
        tracks.random_walk_3(neiros["t1"](), chords["1"], 200, [-1, 1], 0.1, [-1, 1])
    }
}

function choice(x) {
    return x[Math.floor(x.length * Math.random())]
}

function mod(n, m) {
    return ((n % m) + m) % m
}

function start() {
    musics["so-no-2"]()
}

let startRan = false;
document.addEventListener("click", function () {
    if (!startRan) {
        start()
        startRan = true
    }
})