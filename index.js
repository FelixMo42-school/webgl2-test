function createShader(gl, type, source) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    }

    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    
    gl.linkProgram(program)
    
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    
    if (success) {
        return program
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

function resize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth
    var displayHeight = canvas.clientHeight
   
    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
        // Make the canvas the same size
        canvas.width  = displayWidth
        canvas.height = displayHeight
    }
}

function get(url) {
    return new Promise(resolve => $.get(url, data => resolve(data)))
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
   
    // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
    // whatever buffer is bound to the `ARRAY_BUFFER` bind point
    // but so far we only have one buffer. If we had more than one
    // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
   
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2
    ]), gl.STATIC_DRAW);
}

function clear(gl) {
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
}

async function main() {
    let canvas = document.getElementById("canvas")

    resize(canvas)

    let gl = canvas.getContext("webgl2", {
        antialias: true,
        alpha: false,
        desynchronized: true
    })

    let vertexShader = createShader( gl, gl.VERTEX_SHADER,  await get("./shader/vertex.glsl") )
    let fragmentShader = createShader( gl, gl.FRAGMENT_SHADER, await get("./shader/fragment.glsl") )

    let program = createProgram(gl, vertexShader, fragmentShader)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position")
    var positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    var vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    gl.enableVertexAttribArray(positionAttributeLocation)

    var size = 2          // 2 components per iteration
    var type = gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
    var colorLocation = gl.getUniformLocation(program, "u_color")

    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 3
    gl.drawArrays(primitiveType, offset, count)

    // var colorLocation = gl.getUniformLocation(program, "u_color");

    function mainLoop() {
        // clear the canvas
        clear(gl)

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program)

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao)


        // Set a the color.
        gl.uniform4fv(colorLocation, color)

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            0, 0.5,
            0.7, 0,
        ]), gl.STATIC_DRAW)

        let offset = 0
        let count = 6

        gl.drawArrays(gl.TRIANGLES, offset, count)
    }

    mainLoop()
}

main()

// $(main)