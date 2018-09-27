const BABYLON = require('babylonjs');

exports.FreeCam = function(Name, Pos, View, Scene, Canvas) {
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
};

exports.SpaceCam = function(Name, Angel1, Angel2, Distance, Target, scene, canvas) {
  var camera = new BABYLON.ArcRotateCamera(Name,
    BABYLON.Tools.ToRadians(Angel1),
    BABYLON.Tools.ToRadians(Angel2),
    Distance, new BABYLON.Vector3(0, 0, 0), scene
  );
  camera.lockedTarget = Target;
  camera.attachControl(canvas, false);
  camera.maxZ = 1000000000;
};

exports.facePoint = function(Mesh, TargetVector) {
  var DeltaVector = TargetVector.subtract(Mesh.position);
  //Mesh.rotation = Mesh.rotation.add(DeltaVector.normalize());
  Mesh.translate(DeltaVector.normalize(), 6, BABYLON.Space.LOCAL); /// Is Wrong this will move as expected and not rotate
};
