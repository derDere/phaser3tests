const OBJECTS= require('./objects.js');
const BABYLON = require('babylonjs');

exports.SpaceTag = function(Mesh, Type, Scene, Camera, Engine) {
  this.mesh = Mesh;
  this.type = Type;
  this.scene = Scene;
  this.camera = Camera;
  this.engine = Engine;

  this.ele = document.createElement('img');
  this.ele.className = "space-tag";
  this.ele.style.backgroundImage = null;
  this.ele.src = "../images/icons/" + Type.icon + ".png";
  document.body.appendChild(this.ele);

  this.update = function() {
    var BtnPos = BABYLON.Vector3.Project(this.mesh.position, BABYLON.Matrix.Identity(), this.scene.getTransformMatrix(), this.camera.viewport.toGlobal(this.engine));
    var {x, y} = BtnPos;

    x = Math.floor(x - 16);
    y = Math.floor(y - 16);

    var arr = '';

    if (y < 0) { arr += "N"; y = 0; }
    if (y > (window.innerHeight - 32)) { arr += "S"; y = (window.innerHeight - 32); }
    if (x < 0) { arr += "W"; x = 0; }
    if (x > (window.innerWidth - 32)) { arr += "E"; x = (window.innerWidth - 32); }

    if (arr.length > 0) {
      this.ele.style.backgroundImage = "url(../images/icons/arr_" + arr + ".png)";
    } else {
      this.ele.style.backgroundImage = null;
    }

    this.ele.style.top = y + 'px';
    this.ele.style.left = x + 'px';

  }.bind(this);
};

exports.Ui = function() {
  this.spaceTags = [];

  this.update = function() {
    for(var sT of this.spaceTags) {
      sT.update();
    }
  }.bind(this);
};
