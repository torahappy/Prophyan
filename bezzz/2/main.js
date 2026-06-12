const G = {
    width: 500,
    height: 500,
    camera: undefined,
    scene: undefined,
    lastTime: 0,
    delta: undefined,
    chara: {
        pos: {x: 0, y: 0},
        velocity: {x: 0, y: 0},
        material: undefined,
        mesh: undefined,
        geometry: undefined
    },
    bez: [],
    bezT: 0,
    score: 0
}

function init () {
    G.camera = new THREE.OrthographicCamera(
        G.width / -2,
        G.width / 2,
        G.height / 2,
        G.height / -2,
        1,
        2000
    )

    G.camera.position.z = 500

    G.scene = new THREE.Scene()

    G.renderer = new THREE.WebGLRenderer({ antialias: true })
    G.renderer.setSize(G.width, G.height)
    document.body.appendChild(G.renderer.domElement)

    requestAnimationFrame((time) => {
        // event handlers
        window.addEventListener('resize', () => { resize() }, false)
        G.renderer.domElement.addEventListener('mousedown', function (ev) { mousedown(ev) }, false)
        init_animate()
        G.lastTime = 0
        animate(time)
    })
}

function init_animate() {
    // chara
    {
        let ch = G.chara
        ch.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        ch.geometry = new THREE.CircleGeometry(6, 5)
        ch.mesh = new THREE.Mesh(ch.geometry, ch.material)
        ch.mesh.position.z = -10
        G.scene.add(ch.mesh)
    }
}

function calc_bez(a, t, n, i) {
    return a*Math.pow(t, i)*Math.pow(1 - t, n - i)
}

function animate(time) {
    G.delta = time - G.lastTime
    G.lastTime = time
    G.renderer.render(G.scene, G.camera)
    
    // chara
    {
        let ch = G.chara
        ch.mesh.position.x = ch.pos.x
        ch.mesh.position.y = ch.pos.y

        for (let i = 0; i < G.bez.length; i++) {
            let p = G.bez[i]
            ch.pos.x += calc_bez(p[0], G.bezT, G.bez.length, i)
            ch.pos.y += calc_bez(p[1], G.bezT, G.bez.length, i)
        }

        G.bezT += 0.01

        if (!(-G.width/2 < ch.pos.x && ch.pos.x < G.width/2 && -G.height/2 < ch.pos.y && ch.pos.y < G.height/2)) {
            activate_retry()
        }
    }
    
    document.getElementById("score").innerHTML = String(G.score)

    requestAnimationFrame((time) => { animate(time) })
}

function rand_width(a = 1) {
    return (Math.random() * G.width - G.width / 2) * a
}

function rand_height(a = 1) {
    return (Math.random() * G.height - G.height / 2) * a
}

function mousedown (ev) {
    G.score++
    G.bezT = 0
    G.bez = []
    let n = 5
    for (let i = 0; i < n; i++) {
        G.bez.push([rand_width(0.03), rand_height(0.03)])
    }
}

function resize () {

}

function activate_retry () {
    document.getElementById("retry").className = "activate"
}

document.getElementById("retry").addEventListener("click", function () {
    G.chara.pos.x = 0
    G.chara.pos.y = 0
    G.chara.velocity.x = 0
    G.chara.velocity.y = 0
    G.score = 0
    G.bez = []
    G.bezT = 0
    document.getElementById("retry").className = ""
})

init()