const BABYLON = require('babylonjs');
const ps = require('./particle-system.js');
const utils = require('./utils.js');

exports.SpaceShip = function(scene) {
  this.mesh = BABYLON.Mesh.CreateBox("spaceshipAll", 1, scene);
  this.mesh.renderingGroupId = 1;
  this.mesh.isVisible = false;

  var mesh_1 = scene.getMeshByID('_mm1');
  var mesh_2 = scene.getMeshByID('spaceship');
  mesh_1.addChild(mesh_2);
  mesh_1.rotation.y = Math.PI / 2;
  this.mesh.addChild(mesh_1);

  var spaceshipMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
  spaceshipMaterial.diffuseTexture = new BABYLON.Texture("../work/spaceship.png", scene);

  mesh_1.material = spaceshipMaterial;
  mesh_2.material = spaceshipMaterial;

  /*
  this.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.MeshImpostor, {
    mass: 1,
    restitution: 0.9
  }, scene);
  this.mesh.physicsImpostor = this.physicsImpostor;
  */

  var spaceDrive = BABYLON.MeshBuilder.CreateSphere('spaceDrive', {
    diameter: 0.1
  }, scene);
  spaceDrive.renderingGroupId = 1;
  spaceDrive.isVisible = false;
  spaceDrive.position.z = 3.45;
  spaceDrive.position.y = 0.35;
  this.mesh.addChild(spaceDrive);

  var shipDriveParticles = new ps.shipDriveParticles(scene, spaceDrive);

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  this.facePoint = function(TargetVector) {
    utils.facePoint(this.mesh, TargetVector);
  }.bind(this);
};
