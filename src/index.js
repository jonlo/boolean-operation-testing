import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, MeshStandardMaterial, Mesh, BoxGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSG } from 'three-csg-ts';

let container,
	camera,
	scene,
	renderer,
	controls;

let sink = null;
let cube = null;

main();

function main() {
	// dom
	container = document.createElement('div');
	window.addEventListener('resize', onWindowResize, false);
	document.body.appendChild(container);

	// renderer
	renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// scene
	scene = new Scene();
	// camera
	camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(10, 10, 15);

	//controls
	controls = new OrbitControls(camera, renderer.domElement);
	//controls.update() must be called after any manual changes to the camera's transform
	controls.update();
	const light = new AmbientLight(0x404040); // soft white light
	scene.add(light);
	const directionalLight = new DirectionalLight(0xffffff, 0.5);
	scene.add(directionalLight);
	loadObject();
	createCube();
	

};

function loadObject() {
	const loader = new GLTFLoader().setPath('models/');
	loader.load('sink.glb', (glb) => {
		sink = glb.scene;
		scene.add(sink);
		booleanOps();
	});
}

function createCube() {
	const geometry = new BoxGeometry(0.5, 0.5, 0.5);
	const material = new MeshStandardMaterial({ color: 0x00ff00 });
	cube = new Mesh(geometry, material);
	cube.position.set(0,-0.15,0)
	scene.add(cube);
}

function booleanOps(){

	let booleanMesh = cube.clone();
	sink.traverse(child => {
		if (child.isMesh) {
			child.updateMatrix();
			booleanMesh = CSG.subtract(booleanMesh, child);
		}
	});

	scene.remove(cube);
	scene.remove(sink);
	scene.add(booleanMesh);
}

function render() {
	renderer.render(scene, camera);
}

// animate            
(function animate() {
	requestAnimationFrame(animate);
	controls.update();
	render();

}());

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}