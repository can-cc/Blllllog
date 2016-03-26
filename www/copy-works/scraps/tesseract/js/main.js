var scene = new THREE.Scene(),
		w = window.innerWidth,
		h = window.innerHeight - document.querySelector('.controls').getBoundingClientRect().height,
		cam = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, -2000, 2000 ),
		cam = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 ),
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});

cam.position.z = 500;

renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

var faceMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, opacity: .1, transparent: true, side: THREE.DoubleSide});
var wireframe = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
var line = new THREE.LineBasicMaterial({color: 0xFFFFFF});

function geometryFrom4dVerticesAndFaces(vertices, faces, scalar) {
	var projectedVertices = vertices.map(function(v) {
		var vec = vector4ToVector3(v);
		vec.multiplyScalar(scalar);
		return vec;
	});

	var geometry = new THREE.Geometry();
	projectedVertices.reduce(function(g, v) {
		g.vertices.push(v);
		return g;
	}, geometry);

	geometry.faces = faces.map(function(f) {
		return new THREE.Face3(
			f[0],
			f[1],
			f[2]
		)
	});

	return geometry;
}

function vector4ToVector3(v4) {
	var skew = (v4.w * .02) + 1.9;
	return new THREE.Vector3(
		v4.x * skew,
		v4.y * skew,
		v4.z * skew
	)
}

var tesseractVertices = [
	[0,0,0,0],
	[1,0,0,0],
	[1,1,0,0],
	[0,1,0,0],

	[0,0,1,0],
	[1,0,1,0],
	[1,1,1,0],
	[0,1,1,0],

	[0,0,0,1],
	[1,0,0,1],
	[1,1,0,1],
	[0,1,0,1],

	[0,0,1,1],
	[1,0,1,1],
	[1,1,1,1],
	[0,1,1,1]

];

var tesseractPlanes = [
	// First Cube
	[0,1,2,3],
	[4,5,6,7],
	[0,3,7,4],
	[1,2,6,5],
	[3,2,6,7],
	[0,1,5,4],

	// Big cube
	[8,9,10,11],
	[12,13,14,15],
	[8,11,15,12],
	[9,10,14,13],
	[8,9,13,12],
	[11,10,14,15],

	// Adjoining Planes
	[11,3,0,8],
	[15,12,4,7],
	[6,14,13,5],
	[10,9,1,2],

	[11,10,2,3],
	[10,14,6,2],
	[14,15,7,6],
	[7,3,11,15],

	[12,13,5,4],
	[13,9,1,5],
	[8,9,1,0],
	[8,12,4,0]
]

var tesseractFaces = [

	// Discrete Cubes

	// Back/front
	[3,0,1],
	[1,2,3],
	[7,4,5],
	[5,6,7],

	// Top/Bottom
	[3,7,6],
	[6,2,3],
	[0,4,5],
	[5,1,0],

	// Left/Right
	[0,4,7],
	[7,3,0],
	[1,5,6],
	[6,2,1],

	// Back/front
	[11,8,9],
	[9,10,11],
	[15,12,13],
	[13,14,15],

	// Top/Bottom
	[11,15,14],
	[14,10,11],
	[8,12,13],
	[13,9,8],

	// Left/Right
	[8,12,15],
	[15,11,8],
	[9,13,14],
	[14,10,9],

	// End Discrete Cubes

	// Connect top edges
	[3,11,15],
	[15,7,3],

	[2,10,6],
	[6,14,10],

	[7,15,6],
	[6,14,15],

	[3,11,2],
	[2,10,11],

	// Connect bottom edges
	[0,8,12],
	[12,4,0],

	[0,8,9],
	[9,1,0],

	[5,13,9],
	[9,1,5],

	[4,5,13],
	[13,12,4],

	// Connect verticals
	[0,8,3],
	[3,11,8],

	[5,13,14],
	[14,6,5],

	[4,12,15],
	[15,7,4],

	[1,9,10],
	[10,2,1]
];
var cos = Math.cos,
		sin = Math.sin;

function updateMatrices(t) {
	zw.set(
		1,      0,      0,      0,
		0,      1,      0,      0,
		0,      0,  cos(t),-sin(t),
		0,      0,  sin(t),  cos(t)
	);

	xw.set(
	 cos(t),      0,      0, sin(t),
				0,      1,      0,      0,
				0,      0,      1,      0,
	-sin(t),      0,      0,  cos(t)
	);

	yw.set(
      1,      0,      0,      0,
			0, cos(t),      0,-sin(t),
			0,      0,      1,      0,
			0, sin(t),      0,  cos(t)
	)
}

var zw = new THREE.Matrix4();
var xw = new THREE.Matrix4();
var yw = new THREE.Matrix4();

updateMatrices(Math.PI/200);

var tesseractRotationMatrix = zw;

var tesseractState = tesseractVertices.map(function(t) {
	return new THREE.Vector4(
		(t[0] * 100) - 50,
		(t[1] * 100) - 50,
		(t[2] * 100) - 50,
		(t[3] * 100) - 50
	)
});

var tesseractPlaneObjects = tesseractPlanes.map(function(p) {
	var planeGeometry = new THREE.PlaneGeometry(10,10,1);
	var plane = new THREE.Mesh(planeGeometry, faceMaterial);
	scene.add(plane);
	return plane;
});

var tesseractGeom = geometryFrom4dVerticesAndFaces(tesseractState, tesseractFaces, 1);
tesseract = new THREE.Mesh(tesseractGeom, wireframe);
scene.add(tesseract);

tesseract.rotation.x = Math.PI/10;
tesseract.rotation.y = Math.PI/4;

tesseractPlaneObjects.forEach(function(p) { p.rotation.x = tesseract.rotation.x; p.rotation.y = tesseract.rotation.y });

function rotateTesseract() {
	tesseractState.forEach(function(v) {
		v.applyMatrix4(tesseractRotationMatrix);
	});

	var projectedTesseractState = tesseractState.map(function(v) {
		return vector4ToVector3(v);
	});

	tesseractPlaneObjects.forEach(function(p,i) {
		p.geometry.vertices = tesseractPlanes[i].map(function(tp) {
			return projectedTesseractState[tp];
		});

		var triangles = THREE.Shape.Utils.triangulateShape(p.geometry.vertices, []);
		p.geometry.faces = triangles.map(function(t) {
			return new THREE.Face3(t[0],t[1],t[2]);
		});

		p.geometry.elementsNeedUpdate = true;
		p.geometry.verticesNeedUpdate = true;
	});

	tesseract.geometry.vertices = projectedTesseractState;
	tesseract.geometry.verticesNeedUpdate = true;
}


// TRACKBALL CONTROLS

controls = new THREE.TrackballControls( cam, renderer.domElement );

controls.rotateSpeed = 3.0;
controls.zoomSpeed = 1.2;

controls.noZoom = false;
controls.noPan = false;

controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

controls.keys = [ 65, 83, 68 ];


// Inputs

var rotations = {
	zw : true,
	xw : false,
	yw : false
}

function updateRotationMatrix() {
	var matrix = new THREE.Matrix4();
	if (rotations.zw) {
		matrix.multiply(zw);
	}

	if (rotations.yw) {
		matrix.multiply(yw);
	}

	if (rotations.xw) {
		matrix.multiply(xw);
	}

	tesseractRotationMatrix = matrix;
}

document.querySelector('#wireframe').addEventListener('change', function(e) {
	if (this.checked)
		tesseract.visible = true;
	else
		tesseract.visible = false;
});

document.querySelector('#faces').addEventListener('change', function(e) {
	if (this.checked)
		tesseractPlaneObjects.forEach(function(p) { p.visible = true; });
	else
		tesseractPlaneObjects.forEach(function(p) { p.visible = false; });
});

document.querySelector('#xw').addEventListener('change', function(e) {
	rotations.xw = this.checked;
	updateRotationMatrix();
})

document.querySelector('#yw').addEventListener('change', function(e) {
	rotations.yw = this.checked;
	updateRotationMatrix();
});

document.querySelector('#zw').addEventListener('change', function(e) {
	rotations.zw = this.checked;
	updateRotationMatrix();
});

document.querySelector('#speed').addEventListener('input', function(e) {
	var positionInRange = this.value - this.min;
	updateMatrices(Math.PI/(this.max - positionInRange));
	updateRotationMatrix();
})


function render() {
	requestAnimationFrame(render);
	rotateTesseract();
	controls.update();
	renderer.render(scene, cam);
}

render();