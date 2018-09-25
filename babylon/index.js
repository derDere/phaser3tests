const BABYLON = require('babylonjs');

var canvas = document.getElementById('renderCanvas');

// load the 3D engine
var engine = new BABYLON.Engine(canvas, true);

class freeCam {
  constructor(Name, Pos, View, Scene, Canvas) {
    // create a FreeCamera, and set its position to Pos
    this.cam = new BABYLON.FreeCamera(Name, Pos, Scene);
    // target the camera to the View
    this.cam.setTarget(View);
    // attach the camera to the canvas
    this.cam.attachControl(Canvas, false);
    //Set Movement Keys
    this.cam.keysUp.push(87); //W
    this.cam.keysLeft.push(65); //A
    this.cam.keysDown.push(83); //S
    this.cam.keysRight.push(68); //D
  }
}

var sphere;

// createScene function that creates and return the scene
function createScene() {
  // create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine);

  var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

  skybox.infiniteDistance = true;
  skyboxMaterial.disableLighting = true;

  //https://i.pinimg.com/originals/de/38/ad/de38ad4f55903add2fdbe290bcc6ef79.png
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../images/spacebox", scene, ["_px.png", "_py.png", "_pz.png", "_nx.png", "_ny.png", "_nz.png"]);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

  skybox.renderingGroupId = 0;



  // create a FreeCamera, and set its position to (x:0, y:5, z:-10) target the camera to scene origin
  //var camera = new freeCam('camera1', new BABYLON.Vector3(0, 5, -10), BABYLON.Vector3.Zero(), scene, canvas);

  // create a basic light, aiming 0,1,0 - meaning, to the sky
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 1), scene);

  // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
  sphere.renderingGroupId = 1;

  // move the sphere upward 1/2 of its height
  sphere.position.y = 1;

  var camera = new BABYLON.ArcRotateCamera('arcCamera',
    BABYLON.Tools.ToRadians(45),
    BABYLON.Tools.ToRadians(45),
    10.0, sphere.position, scene
  );
  camera.attachControl(canvas, false);

  // create a built-in "ground" shape;
  var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
  ground.renderingGroupId = 1;

  // return the created scene
  return scene;
}

// call the createScene function
var scene = createScene();

// run the render loop
engine.runRenderLoop(() => {
  sphere.position.y += 0.01;
  scene.render();
});

// the canvas/window resize event handler
window.addEventListener('resize', () => {
  engine.resize();
});
