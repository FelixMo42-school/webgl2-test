const canvas = document.getElementById(id)

const gl = canvas.getContext("webgl2", {
    antialias: true,
    alpha: false,
    desynchronized: true
})

const programe = loadPrograme(gl, "./shader")

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

function get(url) {
    return new Promise((resolve, reject) => $.get(url,(data, status) => resolve(data, status)))
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

