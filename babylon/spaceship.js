const BABYLON = require('babylonjs');
const ps = require('./particle-system.js');
const utils = require('./utils.js');

exports.SpaceShip = function(scene) {
  this.scene = scene;

  this.target = null;

  this.mesh = BABYLON.Mesh.CreateBox("spaceshipAll", 1, scene);
  this.mesh.renderingGroupId = 1;
  this.mesh.isVisible = false;

  BABYLON.SceneLoader.Append("../assets/", "spaceship.babylon", scene, function(scene) {
    var mesh_1 = scene.getMeshByID('Spaceship');
    this.mesh.addChild(mesh_1);
    mesh_1.renderingGroupId = 1;

    var spaceshipMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    spaceshipMaterial.diffuseTexture = new BABYLON.Texture("../images/textures/spaceship.png", scene);
    spaceshipMaterial.specularTexture = new BABYLON.Texture("../images/textures/spaceship_s.png", scene);
    spaceshipMaterial.emissiveTexture = new BABYLON.Texture("../images/textures/spaceship_e.png", scene);

    mesh_1.material = spaceshipMaterial;

    var Pilot = BABYLON.Mesh.CreateBox("pilot", 3, scene);
    Pilot.renderingGroupId = 1;
    Pilot.isVisible = false;

    var spaceDrive = BABYLON.MeshBuilder.CreateSphere('spaceDrive', {
      diameter: 0.1
    }, scene);
    spaceDrive.renderingGroupId = 1;
    spaceDrive.isVisible = false;
    spaceDrive.position.z = 3.45;
    spaceDrive.position.y = 0.35;
    this.mesh.addChild(spaceDrive);

    var shipDriveParticles = new ps.shipDriveParticles(scene, spaceDrive);
  }.bind(this));

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  this.facePoint = function(TargetVector) {
    Pilot.position = this.mesh.position;
    Pilot.lookAt(TargetVector);

    var animationQuaternion = new BABYLON.Animation("myAnimation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // Animation keys
    var keys = [];
    keys.push({
        frame: 0,
        value: this.mesh.rotation
    });
    keys.push({
        frame: 100,
        value: Pilot.rotation
    });

    animationQuaternion.setKeys(keys);

    this.mesh.animations.push(animationQuaternion);

    this.scene.beginAnimation(this.mesh, 0, 100, false);
  }.bind(this);

  this.update = function() {
  }.bind(this);
};
