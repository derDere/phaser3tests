const BABYLON = require('babylonjs');


exports.shipDriveParticles = function(scene, emitter) {
  var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
  particleSystem.particleTexture = new BABYLON.Texture("../images/flare.png", scene);
  particleSystem.renderingGroupId = 1;

  // Where the particles come from
  particleSystem.emitter = emitter; // the starting object, the emitter
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
};
