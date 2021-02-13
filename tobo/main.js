let Globals = {}

class Main {

    constructor () {
        Globals.width = window.innerWidth;
        Globals.height = window.innerHeight;

        // camera / scene / renderer preparation
        Globals.camera = new THREE.PerspectiveCamera( 75, Globals.width / Globals.height, 0.1, 1000 );

        Globals.scene = new THREE.Scene()

        Globals.renderer = new THREE.WebGLRenderer()
        Globals.renderer.setSize(Globals.width, Globals.height)
        document.body.appendChild(Globals.renderer.domElement)

        // construct objects
        Globals.eventManagement = new EventManagement()
        //Globals.dots = new Dots()
        Globals.factory = new Factory()
        Globals.keyInput = new KeyInput()

        // first frame: call animate func
        requestAnimationFrame((time) => {
            // event handlers
            window.addEventListener('resize', (ev) => {
                Globals.eventManagement.runEvent('resize', ev)
            }, false)

            Globals.eventManagement.addListener('resize', this.resize)

            window.addEventListener('mousedown', function (ev) {
                Globals.eventManagement.runEvent('mousedown', ev)
            }, false)

            window.addEventListener('keydown', function (ev) {
                Globals.eventManagement.runEvent('keydown', ev)
            }, false)

            window.addEventListener('keyup', function (ev) {
                Globals.eventManagement.runEvent('keyup', ev)
            }, false)

            this.animate(time)
        })
    }

    resize () {
        Globals.width = window.innerWidth;
        Globals.height = window.innerHeight;
        Globals.renderer.setSize(Globals.width, Globals.height)
        Globals.camera.aspect = Globals.width / Globals.height
        //Globals.camera.left = Globals.width / -2
        //Globals.camera.right = Globals.width / 2
        //Globals.camera.top = Globals.height / 2
        //Globals.camera.bottom = Globals.height / -2
        Globals.camera.updateProjectionMatrix()
    }

    animate (time) {
        requestAnimationFrame((time) => {
            this.animate(time)
        })

        if (Globals.time === undefined) {
            Globals.delta = 1000 / 60 // fallback delta value
            Globals.time = time
        } else {
            Globals.delta = time - Globals.time
            Globals.time = time
        }

        Globals.eventManagement.runEvent('animate', {delta: Globals.delta, time: time})

        Globals.renderer.render( Globals.scene, Globals.camera );
    }

}

Globals.main = new Main()