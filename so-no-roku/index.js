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
    for (int i = 0; i < 150; i++) {
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

function activate_tansaku_gui (obj, element, num, num2) {
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
    
    if (num == 0) {
        data.random_id = 0
    }
    element.addEventListener("mousedown", function () {
        if (num == 0) {
            data.random_id = Math.floor(Math.random()*data.N)
            if (num2 == 0) {
                data.velocity[data.random_id] = 0.001
            }
            if (num2 == 1) {
                data.velocity[data.random_id] = 0.01*(Math.random() - 0.5)
            }
            if (num2 == 2) {
                data.velocity[data.random_id] = 0.01*(Math.random())
            }
        }
    })
    element.addEventListener("mouseup", function () {
        if (num == 0) {
            data.velocity[data.random_id] = 0
        }
    })
    return data
}