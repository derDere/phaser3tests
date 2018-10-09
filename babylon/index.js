var electron = require('electron');
var {remote, ipcRenedere} = electron;
const BABYLON = require('babylonjs');
const BABYLON_OBJ_LOADER = require('./babylon.objFileLoader.js');
BABYLON_OBJ_LOADER.init(BABYLON);
const CANNON = require('cannon');
const OBJECTS = require('./objects.js');
const {SpaceShip, Planet, SpaceCam, SkyBox, Ui, SpaceTag, Game} = OBJECTS;

//var wsConnection = new WebSocket('ws://127.0.0.1:1337');
/*wsConnection.onopen = function () {
  console.log('ws open');
  wsConnection.send(JSON.stringify({login:1}));
};
wsConnection.onerror = function (error) {
  console.log('ws error: ' + JSON.stringify(error));
};
wsConnection.onmessage = function (message) {
  console.log(message);
  try {
    var json = JSON.parse(message.data);
  } catch (e) {
    console.log('This doesn\'t look like a valid JSON: ', message.data);
    return;
  }
};*/

var canvas = document.getElementById('renderCanvas');

var ui = new Ui(canvas);

// load the 3D engine
var engine = new BABYLON.Engine(canvas, true);

// createScene function that creates and return the scene
function createScene() {
  // create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  /*for (var mesh of scene.meshes) {
    mesh.renderingGroupId = 1;
  }*/

  // // Enable Physics
  // var gravityVector = new BABYLON.Vector3(0, 0, 0); //-9.81, 0);
  // var physicsPlugin = new BABYLON.CannonJSPlugin();
  // scene.enablePhysics(gravityVector, physicsPlugin);

  var spaceship = new SpaceShip(scene);

  var cam = new SpaceCam('arcCamera', -15, 75, 20.0, scene, canvas);
  cam.target(spaceship.mesh);

  // create a basic light, aiming 0,1,0 - meaning, to the sky
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 1), scene);

  var planet = new Planet('planet', 'mars', 3000, -55000, 30000, 40000, scene);

  //ui.spaceTags.push(new SpaceTag(planet.mesh, OBJECTS.Types.PLANET, scene, cam, engine));

  var skybox = new SkyBox('spacebox', scene);

  spaceship.facePoint(planet.position);

  scene.registerBeforeRender(function() {
    var frustumPlanes = BABYLON.Frustum.GetPlanes(scene.getTransformMatrix());

    if (ui.loginScreen || ui.charSelectScreen  || ui.createCharScreen) {
      skybox.mesh.rotation.y += 0.001;
      skybox.mesh.rotation.x += 0.001;
    }
    planet.mesh.rotate(BABYLON.Axis.Y, 0.001, BABYLON.Space.LOCAL);
    spaceship.mesh.translate(BABYLON.Axis.Z, -0.1, BABYLON.Space.LOCAL);

    //spaceship.update();

    ui.update(frustumPlanes);
  });

  // run the render loop
  engine.runRenderLoop(() => {
    scene.render();
  });

  if (remote.process.argv.indexOf("debug") > -1) {
    scene.debugLayer.show();
  }

  // return the created scene
  return scene;
}

// the canvas/window resize event handler
window.addEventListener('resize', () => {
  engine.resize();
});

/*
document.getElementById('goBtn').addEventListener('click', () => {
  //planetRotation = 0.001;
  //speed += 3;
  //spaceship.facePoint(planet.position);
  //spaceship.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(speed, 0, 0));
});
*/

// call the createScene function
var scene = createScene();

var game = new Game(engine, scene, ui);
