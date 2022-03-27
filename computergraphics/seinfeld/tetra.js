/*
	George Gannon
	hw6: Tetrahedron with textures
*/
var canvas;
var gl;
var program;
var image;

var numVertices  = 36;
var texturesarray=[];
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];
var texturesSrcArray = ["seinfeld1.jpg", "seinfeld2.jpg","seinfeld3.jpg","seinfeld4.jpg" ]

var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -10;
var far = 10;




var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];    

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [45.0, 45.0, 45.0];

var thetaLoc;
// special function to generate triangles with textures
function tri(a, b, c, d){
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     texCoordsArray.push(texCoord[0]);
	 
     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]); 	
	 
     pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]); 


}
var texCoord = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(0.5, 1), 
	
	vec2(0, 0),
    vec2(1, 0),
    vec2(0.5, 1),  
	
	vec2(0, 0),
    vec2(1, 0),
    vec2(0.5, 1), 
	
	vec2(0, 0),
    vec2(1, 0),
    vec2(0.5, 1),
];
var vertices = [
	vec4(0,0,0,1), // 0
	vec4(1,0,1,1), // 1
	vec4(0,1,1,1), // 2 
	vec4(1,1,0,1) // 3
];
function colorTetra()
{
	tri(0,1,2,0);
	tri(1,3,2,1);
	tri(0,3,1,2);
	tri(0,3,2,3);
}
function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}
var PLAYED = false
var mvmloc
var projectionMatrixLoc
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 0.25,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 0.5,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    // generate the mesh vertex positions, color, normal, textures, etc.
    colorTetra();

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    //  initialize the attribute buffers
    //
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
	
	mvmloc = gl.getUniformLocation(program, "modelViewMatrix")
	projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
    // event handler related setup

   
	document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });
	window.addEventListener("keydown", function(){ // p listenrr
		// looked up how to do this because I figured our final project would need it
		console.log(event.key)
		if(event.key=='p' && !PLAYED ){
			PLAYED = true // should prevent the song from playing more than once/overlapping
			var sound = new Audio("seinfeld.mp3")
			sound.play()		
		}
	});
	

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });
	
    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });
    render();
}

function loadTexture(texture, whichTexture) 
{
     // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 0
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture );
    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    // set the texture unit 0 the sampler
    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
var at = vec3(0.5, 0.5, 0.5);
var up = vec3(0, 1, 0);
var eye = vec3(1, 1, 1);
function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}
function render(){
	eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));
	var modelViewMatrix = lookAt(eye, at, up);
	var projectionMatrix =  projectionMatrix = ortho( x_min*AllInfo.zoomFactor - AllInfo.translateX,
                              x_max*AllInfo.zoomFactor - AllInfo.translateX,
                              y_min*AllInfo.zoomFactor - AllInfo.translateY,
                              y_max*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);
	gl.uniformMatrix4fv(mvmloc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
    // ==============  Establish Textures =================
	// create the texture object
	modelViewMatrix = mult(modelViewMatrix, scale4(2,2,2) )
	var texture1 = gl.createTexture()
	texture1.image = new Image();
	texture1.image.src=texturesSrcArray[0];	
	texture1.image.onload = function() {loadTexture(texture1, gl.TEXTURE0);}
	gl.uniform1i(gl.getUniformLocation(program, "texture"),0)
	gl.drawArrays( gl.TRIANGLES, 0, 3 );
	
	var texture2 = gl.createTexture()
	texture2.image = new Image();
	texture2.image.src=texturesSrcArray[1];	
	texture2.image.onload = function() {loadTexture(texture2, gl.TEXTURE1);}
	gl.uniform1i(gl.getUniformLocation(program, "texture"),1)
	gl.drawArrays( gl.TRIANGLES, 3, 3 );
	
	var texture3 = gl.createTexture()
	texture3.image = new Image();
	texture3.image.src=texturesSrcArray[2];	
	texture3.image.onload = function() {loadTexture(texture3, gl.TEXTURE2);}
	gl.uniform1i(gl.getUniformLocation(program, "texture"),2)
	gl.drawArrays( gl.TRIANGLES, 6, 3 );
	
	var texture4 = gl.createTexture()
	texture4.image = new Image();
	texture4.image.src=texturesSrcArray[3];	
	texture4.image.onload = function() {loadTexture(texture4, gl.TEXTURE3);}
	gl.uniform1i(gl.getUniformLocation(program, "texture"),3)
	gl.drawArrays( gl.TRIANGLES, 9, 3 );
}

