const BABYLON = require('babylonjs');

var LoadedMeshs = {};
var LoadedMeshsCount = {};

exports.loadMesh = function(Name, Scene, Args, callback) {
  if (Name in LoadedMeshs) {
    var NewMesh = LoadedMeshs[Name].clone(Name + ':' + LoadedMeshsCount[Name]);
    LoadedMeshsCount[Name] += 1;
    callback(Scene, Args, NewMesh);
  } else {
    BABYLON.SceneLoader.Append("../assets/", Name + ".babylon", Scene, function(scene) {
      var NewMesh = scene.meshes[scene.meshes.length - 1];
      LoadedMeshs[Name] = NewMesh;
      LoadedMeshsCount[Name] = 1;
      callback(scene, Args, NewMesh);
    });
  }
};

exports.FreeCam = function(Name, Pos, View, Scene, Canvas) {
  // create a FreeCamera, and set its position to Pos
  this.cam = new BABYLON.FreeCamera(Name, Pos, Scene);
  // target the camera to the View
  this.cam.setTarget(View);
  this.setTarget = this.cam.setTarget;
  // attach the camera to the canvas
  this.cam.attachControl(Canvas, false);
  //Set Movement Keys
  this.cam.keysUp.push(87); //W
  this.cam.keysLeft.push(65); //A
  this.cam.keysDown.push(83); //S
  this.cam.keysRight.push(68); //D
};

exports.SpaceCam = function(Name, Angel1, Angel2, Distance, scene, canvas) {
  var camera = new BABYLON.ArcRotateCamera(Name,
    BABYLON.Tools.ToRadians(Angel1),
    BABYLON.Tools.ToRadians(Angel2),
    Distance, new BABYLON.Vector3(0, 0, 0), scene
  );
  this.viewport = camera.viewport;
  //camera.lockedTarget = Target;
  this.target = function(Mesh) {
    camera.lockedTarget = Mesh;
  }.bind(this);
  camera.attachControl(canvas, false, false, 1);
  camera.maxZ = 1000000000;
};
