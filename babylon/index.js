var electron = require('electron');
var {remote, ipcRenedere} = electron;
const BABYLON = require('babylonjs');
const GUI = require('babylonjs-gui');
const BABYLON_OBJ_LOADER = require('./babylon.objFileLoader.js');
BABYLON_OBJ_LOADER.init(BABYLON);
const CANNON = require('cannon');
const OBJECTS = require('./objects.js');
const {SpaceShip, Planet, SpaceCam, SkyBox, Ui} = OBJECTS;

var speed = 0;
var planetRotation = 0;

var PlanetBtn = document.createElement('button');
PlanetBtn.innerText = "Planet";
PlanetBtn.style.position = 'absolute';
document.body.appendChild(PlanetBtn);

var canvas = document.getElementById('renderCanvas');

// load the 3D engine
var engine = new BABYLON.Engine(canvas, true);

var spaceship, planet;

// createScene function that creates and return the scene
function createScene() {
  // create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine);

  BABYLON.SceneLoader.Append("../assets/", "spaceship.obj", scene, function(scene) {
    for (var mesh of scene.meshes) {
      mesh.renderingGroupId = 1;
    }

    // Enable Physics
    var gravityVector = new BABYLON.Vector3(0, 0, 0); //-9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    spaceship = new SpaceShip(scene);

    var cam = new SpaceCam('arcCamera', -15, 75, 20.0, spaceship.mesh, scene, canvas);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 1), scene);

    planet = new Planet('planet', 'mars', 3000, -55000, 30000, 40000, scene);

    var skybox = new SkyBox('spacebox', scene);

    // run the render loop
    engine.runRenderLoop(() => {
      planet.mesh.rotate(BABYLON.Axis.Y, planetRotation, BABYLON.Space.LOCAL);
      spaceship.mesh.translate(BABYLON.Axis.Z, -speed, BABYLON.Space.LOCAL);

      var BtnPos = BABYLON.Vector3.Project(planet.mesh.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), cam.viewport.toGlobal(engine));
      PlanetBtn.style.top = Math.floor(BtnPos.y) + 'px';
      PlanetBtn.style.left = Math.floor(BtnPos.x) + 'px';

      scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      engine.resize();
    });
  });

  if (remote.process.argv.indexOf("debug") > -1) {
    scene.debugLayer.show();
  }

  // return the created scene
  return scene;
}

document.getElementById('goBtn').addEventListener('click', () => {
  planetRotation = 0.001;
  speed += 3;
  spaceship.facePoint(planet.position);
  //spaceship.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(speed, 0, 0));
});

// call the createScene function
var scene = createScene();
