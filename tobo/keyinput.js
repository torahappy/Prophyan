class KeyInput {
    constructor () {
        Globals.eventManagement.addListener("animate", (ev) => {this.update(ev)})
        Globals.eventManagement.addListener("keydown", (ev) => {this.keydown(ev)})
        Globals.eventManagement.addListener("keyup", (ev) => {this.keyup(ev)})
        this.keymap = {
            "s": "x-",
            "w": "x+",
            "d": "y-",
            "a": "y+",
            "e": "z+",
            "q": "z-",
            "g": "X-",
            "j": "X+",
            "h": "Y-",
            "y": "Y+",
            "r": "Z+",
            "f": "Z-"
        }
        this.pressed = {}
        for (let i in this.keymap) {
            this.pressed[i] = false;
        }
        this.velocity = {
            "r": new THREE.Vector3(), // rotation
            "p": new THREE.Vector3()  // position
        }
        this.coeffs = {
            "x-": 0.00001,
            "x+": 0.00001,
            "y-": 0.00001,
            "y+": 0.00001,
            "z+": 0.00001,
            "z-": 0.00001,
            "X-": 0.00001,
            "X+": 0.00001,
            "Y-": 0.00001,
            "Y+": 0.00001,
            "Z+": 0.00001,
            "Z-": 0.00001
        }
    }
    keydown (ev) {
        let k = ev.key.toLowerCase();
        if (this.keymap[k] !== undefined) {
            this.pressed[k] = true
        }
    }
    keyup (ev) {
        let k = ev.key.toLowerCase();
        if (this.keymap[k] !== undefined) {
            this.pressed[k] = false
        }
    }
    update (ev) {
        for (let key in this.keymap) {
            if (this.pressed[key] === true) {
                let target = this.keymap[key]
                let axis = target[0]
                let sign;
                if (target[1] === "+") {
                    sign = 1
                } else if (target[1] === "-") {
                    sign = -1
                }
                let coeff = sign * this.coeffs[target] * ev.delta;
                if (axis === 'x') {
                    this.velocity["r"].x += coeff
                } else if (axis === 'y') {
                    this.velocity["r"].y += coeff
                } else if (axis == 'z') {
                    this.velocity["r"].z += coeff
                } else if (axis === 'X') {
                    let vector = new THREE.Vector3( 1 , 0, 0 );
                    vector.applyQuaternion(Globals.camera.quaternion);
                    this.velocity['p'].add(vector.multiplyScalar(coeff))
                } else if (axis === 'Y') {
                    let vector = new THREE.Vector3( 0, 1, 0 );
                    vector.applyQuaternion(Globals.camera.quaternion);
                    this.velocity['p'].add(vector.multiplyScalar(coeff))
                } else if (axis === 'Z') {
                    let vector = new THREE.Vector3( 0, 0, - 1 );
                    vector.applyQuaternion(Globals.camera.quaternion);
                    this.velocity['p'].add(vector.multiplyScalar(coeff))
                }
            }
        }
        Globals.camera.rotateX(this.velocity['r'].x)
        Globals.camera.rotateY(this.velocity['r'].y)
        Globals.camera.rotateZ(this.velocity['r'].z)
        Globals.camera.position.add(this.velocity['p'])
    }
}