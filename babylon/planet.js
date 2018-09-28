const BABYLON = require('babylonjs');

exports.Planet = function(Name, Texture, PosX, PosY, PosZ, Size, scene) {
  var planet = BABYLON.MeshBuilder.CreateSphere(Name, {
    diameter: Size
  }, scene);
  planet.position.x = PosX;
  planet.position.y = PosY;
  planet.position.z = PosZ;
  planet.renderingGroupId = 1;

  this.position = planet.position;
  this.mesh = planet;

  var planetMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
  planetMaterial.diffuseTexture = new BABYLON.Texture("../images/2k_" + Texture + ".jpg", scene);
  planetMaterial.specularTexture = new BABYLON.Texture("../images/2k_" + Texture + "_s.jpg", scene);
  planetMaterial.emissiveTexture = new BABYLON.Texture("../images/2k_" + Texture + "_e.jpg", scene);
  planetMaterial.ambientTexture = new BABYLON.Texture("../images/2k_" + Texture + "_a.jpg", scene);
  planet.material = planetMaterial;
};
