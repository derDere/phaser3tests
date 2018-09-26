const BABYLON = require('babylonjs');
const BABYLON_OBJ_LOADER = require('./babylon.objFileLoader.js');
BABYLON_OBJ_LOADER.init(BABYLON);
const CANNON = require('cannon');

var speed = 0;

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

var spaceship;

// createScene function that creates and return the scene
function createScene() {
  // create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine);

  BABYLON.SceneLoader.Append("../assets/", "spaceship.obj", scene, function(scene) {
    for (var mesh of scene.meshes) {
      mesh.renderingGroupId = 1;
    }
    spaceship = scene.getMeshByID('_mm1');
    spaceship.addChild(scene.getMeshByID('spaceship'));

    var spaceshipMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    spaceshipMaterial.diffuseTexture = new BABYLON.Texture("../work/spaceship.png", scene);
    //myMaterial.specularTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
    //myMaterial.emissiveTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
    //myMaterial.ambientTexture = new BABYLON.Texture("PATH TO IMAGE", scene);

    spaceship.material = spaceshipMaterial;

    var spaceDrive = BABYLON.MeshBuilder.CreateSphere('planet', {
      diameter: 0.1
    }, scene);
    spaceDrive.renderingGroupId = 1;
    spaceDrive.position.x = -3.45;
    spaceDrive.position.y = 0.35;
    spaceship.addChild(spaceDrive);

    var camera = new BABYLON.ArcRotateCamera('arcCamera',
      BABYLON.Tools.ToRadians(-15),
      BABYLON.Tools.ToRadians(75),
      20.0, new BABYLON.Vector3(0, 0, 0), scene
    );
    camera.lockedTarget = spaceship;
    camera.attachControl(canvas, false);
    camera.maxZ = 1000000000;
    //spaceship.addChild(camera);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 1), scene);

    var planet = BABYLON.MeshBuilder.CreateSphere('planet', {
      diameter: 40000
    }, scene);
    planet.position.x = 3000;
    planet.position.y = -55000;
    planet.position.z = 30000;
    planet.renderingGroupId = 1;

    var planetMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    planetMaterial.diffuseTexture = new BABYLON.Texture("../images/2k_mars.jpg", scene);
    planetMaterial.specularTexture = new BABYLON.Texture("../images/2k_mars_s.jpg", scene);
    planetMaterial.emissiveTexture = new BABYLON.Texture("../images/2k_mars_e.jpg", scene);
    planetMaterial.ambientTexture = new BABYLON.Texture("../images/2k_mars_a.jpg", scene);
    planet.material = planetMaterial;
    /*
    // create a built-in "ground" shape;
    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
    ground.renderingGroupId = 1;
    */

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

    // Enable Physics
    var gravityVector = new BABYLON.Vector3(0, 0, 0); //-9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    // Creating Physics Imposter for spaceship
    spaceship.physicsImpostor = new BABYLON.PhysicsImpostor(spaceship, BABYLON.PhysicsImpostor.MeshImpostor, {
      mass: 1,
      restitution: 0.9
    }, scene);

    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("../images/flare.png", scene);
    particleSystem.renderingGroupId = 1;

    // Where the particles come from
    particleSystem.emitter = spaceDrive; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.4;
    particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.15;
    particleSystem.maxLifeTime = 0.2;

    // Emission rate
    particleSystem.emitRate = 1500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();

    // run the render loop
    engine.runRenderLoop(() => {
      //if (speed < 3000) speed += 30;
      //spaceship.position.x += speed;
      //spaceship.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(2, 0, 0));
      //spaceship.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 1));
      scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      engine.resize();
    });
  });

  // return the created scene
  return scene;
}

document.getElementById('goBtn').addEventListener('click', () => {
  speed += 3;
  spaceship.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(speed, 0, 0));
});

// call the createScene function
var scene = createScene();
