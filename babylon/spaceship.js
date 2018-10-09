const BABYLON = require('babylonjs');
const ps = require('./particle-system.js');
const utils = require('./utils.js');

exports.SpaceShip = function(scene) {
  this.scene = scene;

  this.target = null;

  this.mesh = BABYLON.Mesh.CreateBox("spaceshipAll", 1, scene);
  this.mesh.renderingGroupId = 1;
  this.mesh.isVisible = false;

  this.shipMesh = null;

  var Pilot = BABYLON.Mesh.CreateBox("pilot", 3, scene);
  Pilot.renderingGroupId = 1;
  Pilot.isVisible = false;

  var spaceshipMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
  spaceshipMaterial.diffuseTexture = new BABYLON.Texture("../images/textures/spaceship.png", scene);
  spaceshipMaterial.specularTexture = new BABYLON.Texture("../images/textures/spaceship_s.png", scene);
  spaceshipMaterial.emissiveTexture = new BABYLON.Texture("../images/textures/spaceship_e.png", scene);

  BABYLON.SceneLoader.Append("../assets/", "spaceship.babylon", scene, function(scene) {
    this.shipMesh = scene.getMeshByID('Spaceship');
    this.mesh.addChild(this.shipMesh);
    this.shipMesh.renderingGroupId = 1;

    this.shipMesh.material = spaceshipMaterial;

    var Drives = [
      {
        x: 0.81,
        y: 0.05,
        z: 1.15,
        s: {
          x: 1.6,
          y: 1.6,
          z: 1.6
        }
      },
      {
        x: -1.5,
        y: -0.1,
        z: 1.05,
        s: {
          x: 0.75, //3,
          y: 0.75
        }
      },
      {
        x: -3.35,
        y: -0.28,
        z: 0.65,
        s: {
          x: 0.5,
          y: 0.3
        }
      }
    ];
    for (var drive of Drives) {
      var spaceDrive = BABYLON.MeshBuilder.CreateSphere('spaceDrive', {
        diameter: 0.5
      }, scene);
      spaceDrive.renderingGroupId = 1;
      spaceDrive.isVisible = false;
      spaceDrive.position.x = drive.x;
      spaceDrive.position.y = drive.y;
      spaceDrive.position.z = drive.z;
      this.shipMesh.addChild(spaceDrive);

      var shipDriveParticles = new ps.shipDriveParticles(scene, spaceDrive, drive.s);
    }
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
