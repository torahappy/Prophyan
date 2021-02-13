class Dots {
    constructor () {
        this.pixels = 100000
        //this.boxes = 10
        //this.boxes_distance = 1000
        this.geometry = new THREE.BufferGeometry()
        this.positionData = new THREE.BufferAttribute(new Float32Array(this.pixels * 3), 3)
        this.colorData = new THREE.BufferAttribute(new Float32Array(this.pixels * 3), 3)

        for (let i = 0; i < this.pixels; i++) {
            let mr = () => ((Math.random() - 0.5))
            let r = () => (Math.random())
            this.positionData.array[i*3] = Math.sin(mr()*4)
            this.positionData.array[i*3+1] = Math.sin(mr()*4)
            this.positionData.array[i*3+2] = Math.sin(mr()*4)
            this.colorData.array[i*3] = Math.sin(r()*Math.PI)
            this.colorData.array[i*3+1] = Math.sin(r()*Math.PI)
            this.colorData.array[i*3+2] = Math.sin(r()*Math.PI)
        }

        this.geometry.setAttribute('position', this.positionData)
        this.geometry.setAttribute('color', this.colorData)
        this.material = new THREE.PointsMaterial({ vertexColors: true, size: 1, sizeAttenuation: false })
        this.points = new THREE.Points(this.geometry, this.material)
        Globals.scene.add( this.points );
        Globals.eventManagement.addListener("animate", (ev) => {this.update(ev)});
    }
    update (ev) {
    }
}