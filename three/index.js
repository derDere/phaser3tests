const THREE = require('three');

// Set the scene size.
const WIDTH = 1900;
const HEIGHT = 1000;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// Get the DOM element to attach to
const container = document.querySelector('#container');

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer();
const camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
  );

const scene = new THREE.Scene();

// Add the camera to the scene.
scene.add(camera);

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the renderer-supplied
// DOM element.
container.appendChild(renderer.domElement);

// Set up the sphere vars
const RADIUS = 50;
const SEGMENTS = 16;
const RINGS = 16;

const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});
// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
const sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS), sphereMaterial);

// Move the Sphere back in Z so we
// can see it.
sphere.position.z = -300;

// Finally, add the sphere to the scene.
scene.add(sphere);

// create a point light
const pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

//skybox
 var imagePrefix = "../images/skybox_";
 var directions  = ["px", "nx", "py", "ny", "pz", "nz"];
 var imageSuffix = ".png";

 var materialArray = [];
 for (var i = 0; i < 6; i++)
  materialArray.push( new THREE.MeshBasicMaterial({
   map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
   side: THREE.BackSide
  }));

 var skyGeometry = new THREE.CubeGeometry( FAR, FAR, FAR );
 var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
 var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
 skyBox.rotation.x += Math.PI / 2;
 scene.add( skyBox );

// Draw!
renderer.render(scene, camera);

function update () {
  //sphere.position.z += 0.1;
  camera.rotation.y += 0.003;

  // Draw!
  renderer.render(scene, camera);

  // Schedule the next frame.
  requestAnimationFrame(update);
}

// Schedule the first frame.
requestAnimationFrame(update);