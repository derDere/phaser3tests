const BABYLON = require('babylonjs');

exports.SkyBox = function (Texture, scene) {
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

  skybox.infiniteDistance = true;
  skyboxMaterial.disableLighting = true;

  //https://i.pinimg.com/originals/de/38/ad/de38ad4f55903add2fdbe290bcc6ef79.png
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../images/skyboxes/" + Texture, scene, ["_px.png", "_py.png", "_pz.png", "_nx.png", "_ny.png", "_nz.png"]);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

  skybox.renderingGroupId = 0;
};
