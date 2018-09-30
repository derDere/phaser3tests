const OBJECTS = require('./objects.js');
const BABYLON = require('babylonjs');

exports.SpaceTag = function(Mesh, Type, Scene, Camera, Engine) {
  this.mesh = Mesh;
  this.type = Type;
  this.scene = Scene;
  this.camera = Camera;
  this.engine = Engine;

  this.bounds = {
    x: 0,
    y: 0,
    w: 10,
    h: 10
  };
  this.menu = function() {
    return {
      "_Name_": "Planet",
      "Approach": "0",
      "Cicle": {
        "5km": "0",
        "10km": "1",
        "20km": "2",
        "50km": "3",
        "100km": "4"
      },
      "Keep in distance": {
        "5km": "0",
        "10km": "1",
        "20km": "2",
        "50km": "3",
        "100km": "4"
      }
    };
  };

  this.ele = document.createElement('img');
  this.ele.className = "space-tag";
  this.ele.style.backgroundImage = null;
  this.ele.src = "../images/icons/" + Type.icon + ".png";
  document.body.appendChild(this.ele);

  this.contains = function(point) {
    if (
      (point.x >= this.bounds.x) &&
      (point.x < (this.bounds.x + this.bounds.w)) &&
      (point.y >= this.bounds.y) &&
      (point.y < (this.bounds.y + this.bounds.h))
    ) {
      return true;
    } else {
      return false;
    }
  }.bind(this);

  this.update = function(frustumPlanes) {
    var BtnPos = BABYLON.Vector3.Project(this.mesh.position, BABYLON.Matrix.Identity(), this.scene.getTransformMatrix(), this.camera.viewport.toGlobal(this.engine));
    var {x, y} = BtnPos;

    x = Math.floor(x - 16);
    y = Math.floor(y - 16);

    var arr = '';

    if (y < 0) {
      arr += "N";
      y = 0;
    }
    if (y > (window.innerHeight - 32)) {
      arr += "S";
      y = (window.innerHeight - 32);
    }
    if (x < 0) {
      arr += "W";
      x = 0;
    }
    if (x > (window.innerWidth - 32)) {
      arr += "E";
      x = (window.innerWidth - 32);
    }

    if (arr.length > 0) {
      this.ele.style.backgroundImage = "url(../images/icons/arr_" + arr + ".png)";
    } else {
      if (!this.mesh.isInFrustum(frustumPlanes)) return;
      this.ele.style.backgroundImage = null;
    }

    this.bounds.x = x + 11;
    this.bounds.y = y + 11;
    this.ele.style.top = y + 'px';
    this.ele.style.left = x + 'px';

  }.bind(this);
};

var ContextMenu = function(X, Y, Items) {
  this.MenuEle = document.createElement('div');
  this.MenuEle.className = 'context-menu';
  this.MenuEle.style.top = X + 'px';
  this.MenuEle.style.left = Y + 'px';
  document.body.appendChild(this.MenuEle);

  this.addItem = function(Label, Data) {

  };

  if (Items.length <= 1) {

  }
};

exports.Ui = function() {
  this.spaceTags = [];

  this.update = function(frustumPlanes) {
    for (var sT of this.spaceTags) {
      sT.update(frustumPlanes);
    }
  }.bind(this);

  var DocumentClickHandler = function(e) {
    if (e.button == 2) {
      var Menus = this.getMenus(e.clientX, e.clientY);
      var i = 0;
    }
  }.bind(this);
  window.addEventListener('mousedown', DocumentClickHandler);

  this.getMenus = function(X, Y) {
    var point = {x:X, y:Y};
    var Menus = [];
    for (var sT of this.spaceTags) {
      if (sT.contains(point)) {
        Menus.push(sT.menu());
      }
    }
    return Menus;
  }.bind(this);
};
