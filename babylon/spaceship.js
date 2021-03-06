const BABYLON = require('babylonjs');
const ps = require('./particle-system.js');
const utils = require('./utils.js');

exports.SpaceShip = function(scene) {
  this.scene = scene;
  this.Tools = [];
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

  var Tools = [
    {
      x: 0.8,
      y: 1.3,
      z: 0,
      r: 0,
      slot: null,
      ready: false
    },
    {
      x: 0.8,
      y: -1.3,
      z: 0,
      r: Math.PI,
      slot: null,
      ready: false
    }
  ];
  //this.Tools = Tools;
  for (var tool of Tools) {
    var toolSlot = BABYLON.MeshBuilder.CreateSphere('toolSlot', {
      diameter: 0.1
    }, scene);
    tool.slot = toolSlot;
    toolSlot.renderingGroupId = 1;
    //toolSlot.scaling.x = 100;
    toolSlot.isVisible = false;
    toolSlot.position.x = tool.x;
    toolSlot.position.y = tool.y;
    toolSlot.position.z = tool.z;
    this.mesh.addChild(toolSlot);
    this.Tools.push(tool);

    utils.loadMesh("kanon1", scene, {toolSlot: toolSlot, tool: tool}, function(scene, args, mesh) {
      mesh.renderingGroupId = 1;
      mesh.rotate(BABYLON.Axis.Z, args.tool.r, BABYLON.Space.LOCAL);

      args.toolSlot.addChild(mesh);
      mesh.position.x = 0;
      mesh.position.y = 0;
      mesh.position.z = 0;

      var toolMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
      toolMaterial.diffuseTexture = new BABYLON.Texture("../images/textures/kanon1.png", scene);
      toolMaterial.specularTexture = new BABYLON.Texture("../images/textures/kanon1_s.png", scene);
      mesh.material = toolMaterial;

      args.tool.ready = true;
    });
  }

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

  this.target = function(toolIndex, TargetVector) {
    if (this.Tools[toolIndex].ready) {
        var Tool = this.Tools[toolIndex].slot;

        //this.scene.stopAnimation(Tool);
        //Tool.animations = [];

        if (Tool.animations.length <= 0) {
          var startRota = Tool.rotation.clone();
          Tool.lookAt(TargetVector);
          var endRota = Tool.rotation;
          Tool.rotation = startRota;

          var ani = new BABYLON.Animation("myAnimation", "rotation", 120, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

          var keys = [];
          keys.push({
              frame: 0,
              value: startRota
          });
          keys.push({
              frame: 100,
              value: endRota
          });

          ani.setKeys(keys);

          Tool.animations.push(ani);

          this.scene.beginAnimation(Tool, 0, 100, false);
        }
    }
  }.bind(this);

  this.facePoint = function(TargetVector) {
    this.scene.stopAnimation(this.mesh);
    this.mesh.animations = [];

    Pilot.position = this.mesh.position;
    Pilot.lookAt(TargetVector);

    var ani = new BABYLON.Animation("myAnimation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

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

    ani.setKeys(keys);

    this.mesh.animations.push(ani);

    this.scene.beginAnimation(this.mesh, 0, 100, false);
  }.bind(this);

  this.update = function() {
  }.bind(this);
};
