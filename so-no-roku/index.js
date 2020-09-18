function tansaku (default_params) {
    const data = {};
    
    const renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    data.renderer = renderer
    renderer.setSize(500, 500);
    
    const scene = new THREE.Scene();
    data.scene = scene
    
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    data.camera = camera
    
    data.tick = function (timestamp) {
        renderer.render(scene, camera);
        requestAnimationFrame(data.tick);
    }
    data.tick()
    
    const uniforms = {
        delta: { value : [0.2, 0.2] },
        pos: { value : [0, 0] },
        scale: { value : 36.6 },
        compscale: { value : [1, 1] },
        colorscale_x: { value : [1, 0.7, 0.4] },
        colorscale_y: { value : [0.3, 0.1, 0.6] },
        nume_5: { value : [1, 1] },
        nume_4: { value : [1, 1] },
        nume_3: { value : [1, 1] },
        nume_2: { value : [1, 1] },
        nume_1: { value : [1, 1] },
        nume_0: { value : [1, 1] },
        deno_5: { value : [0, 0] },
        deno_4: { value : [5, 5] },
        deno_3: { value : [4, 4] },
        deno_2: { value : [3, 3] },
        deno_1: { value : [2, 2] },
        deno_0: { value : [1, 1] },
        iter: { value : 150 },
    }
    data.uniforms = uniforms

    const mat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
}
`,
        fragmentShader: `
varying vec2 vUv;
uniform vec2 delta;
uniform float scale;
uniform vec2 compscale;
uniform vec3 colorscale_x;
uniform vec3 colorscale_y;
uniform vec2 nume_5;
uniform vec2 nume_4;
uniform vec2 nume_3;
uniform vec2 nume_2;
uniform vec2 nume_1;
uniform vec2 nume_0;
uniform vec2 deno_5;
uniform vec2 deno_4;
uniform vec2 deno_3;
uniform vec2 deno_2;
uniform vec2 deno_1;
uniform vec2 deno_0;
uniform vec2 pos;
uniform int iter;

vec2 compmul(vec2 a, vec2 b) {
	return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
vec2 compdiv(vec2 a, vec2 b) {
	return vec2(a.x*b.x + a.y*b.y, - a.x*b.y + a.y*b.x)/(dot(b, b));
}
vec2 nume(vec2 a1) {
	vec2 a2 = compmul(a1, a1);
	vec2 a3 = compmul(a2, a1);
	vec2 a4 = compmul(a3, a1);
	vec2 a5 = compmul(a4, a1);
	return nume_5*a5 + nume_4*a4 + nume_3*a3 + nume_2*a2 + nume_1*a1 + nume_0;
}
vec2 deno(vec2 a1) {
	vec2 a2 = compmul(a1, a1);
	vec2 a3 = compmul(a2, a1);
	vec2 a4 = compmul(a3, a1);
	vec2 a5 = compmul(a4, a1);
	return deno_5*a5 + deno_4*a4 + deno_3*a3 + deno_2*a2 + deno_1*a1 + deno_0;
}
void main() {
    float pi = 3.1415926535897932384626433832795;
    vec2 val = (vec2(vUv.x, vUv.y) - vec2(0.5, 0.5) + pos)*vec2(scale, scale);
    for (int i = 0; i < iter; i++) {
        val = val - compmul(delta, compdiv(nume(val), deno(val)));
    }
    val = val * compscale;
    vec2 col = (vec2(atan(val.x), atan(val.y)) + (pi / 2.0)) / pi;
    gl_FragColor = vec4(
        col.x * colorscale_x.x + col.y * colorscale_y.x,
        col.x * colorscale_x.y + col.y * colorscale_y.y,
        col.x * colorscale_x.z + col.y * colorscale_y.z,
        1.0);
}
`
    });
    data.mat = mat
    
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2, 1, 1 ), mat);
    data.mesh = mesh
    
    scene.add(mesh);
    
    const parameters = [];
    data.parameters = parameters
    
    for (let i in uniforms) {
        if (i == "iter") { continue; }
        let val = uniforms[i].value
        if (Array.isArray(val)) {
            for (let j = 0; j < val.length; j++) {
                parameters.push(['array', i, j])
            }
        } else if (typeof(val) == 'number') {
            parameters.push(['number', i])
        } else {
            throw new TypeError()
        }
    }
    
    return data    
}

function get_param(obj, param_id) {
    let info = obj.parameters[param_id]
    if (info[0] === 'array') {
        return obj.mat.uniforms[info[1]].value[info[2]]
    } else if (info[0] === 'number') {
        return obj.mat.uniforms[info[1]].value
    } else {
        throw new TypeError()
    }
}

function set_param(obj, param_id, value) {
    let info = obj.parameters[param_id]
    if (info[0] === 'array') {
        obj.mat.uniforms[info[1]].value[info[2]] = value
    } else if (info[0] === 'number') {
        obj.mat.uniforms[info[1]].value = value
    }
}

function activate_tansaku_gui (obj, element, options, num2) {
    if (options.input === undefined) {
        options.input = "mouse"
    }
    if (options.stop === undefined) {
        options.stop = true
    }
    if (options.randwalk === undefined) {
        options.randwalk = true
    }
    let data = {}
    data.tansaku_obj = obj
    data.N = obj.parameters.length;
    data.tickbase = obj.tick;
    data.start = null;
    obj.tick = function (timestamp) {
        if (data.start) {
            const delta = timestamp - data.start;
            const coeff = delta / (1000 / 60);
            if (isFinite(coeff)) {
                for (let i = 0; i < data.N; i++) {
                    let target = get_param(obj, i)
                    set_param(obj, i, target + data.velocity[i])
                }
            }
        }
        data.start = timestamp;
        data.tickbase(timestamp)
    }
    data.velocity = []
    for (let i = 0; i < data.N; i++) {
        data.velocity[i] = 0
    }
    
    function rand() {
        if (options.randtype == "const") {
            return (options.randsize || 0.001)
        }
        if (options.randtype == "notfair") {
           return (options.randsize || 0.01)*Math.random()
        }
        if (options.randtype == "fair") {
           return (options.randsize || 0.01)*(Math.random() - 0.5)
        }
    }
    if (options.input == "keyboard") {
        data.randoms = {}
        data.valid_keys = "qwertyuiopasdfghjklzxcvbnm"
        for (let c of data.valid_keys) {
            if (options.change == "single") {
                data.randoms[c] = [Math.floor(Math.random()*data.N), rand()]
            }
            if (options.change == "all") {
                data.randoms[c] = []
                for (let id in data.velocity) {
                    data.randoms[c][id] = rand()
                }
            }
        }
        element.addEventListener("keydown", function (ev) {
            if (ev.key.length == 1 && data.valid_keys.includes(ev.key)) {
                if (options.change == "single") {
                    let random_id = data.randoms[ev.key][0]
                    data.velocity[random_id] = data.randoms[ev.key][1]
                }
                if (options.change == "all") {
                    for (let id in data.velocity) {
                        data.velocity[id] = data.randoms[ev.key][id]
                    }
                }
            }
        })
        element.addEventListener("keyup", function (ev) {
            if (options.stop === true) {
                if (options.change == "single" || options.change == "all") {
                    for (let id in data.velocity) {
                        data.velocity[id] = 0
                    }
                }
            }
        })
    }
    if (options.input == "mouse") {
        element.addEventListener("mousedown", function () {
            if (options.change == "single") {
                data.velocity[Math.floor(Math.random()*data.N)] = rand()
            }
            if (options.change == "all") {
                for (let id in data.velocity) {
                    data.velocity[id] = rand()
                }
            }
        })
        element.addEventListener("mouseup", function () {
            if (options.stop === true) {
                if (options.change == "single" || options.change == "all") {
                    for (let id in data.velocity) {
                        data.velocity[id] = 0
                    }
                }
            }
        })
    }
    return data
}