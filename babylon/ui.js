const OBJECTS = require('./objects.js');
const BABYLON = require('babylonjs');

/*****************************************************************************************************************************
 * Create a Icon in Space to Label Object like Planets, Stations, Ships, Cargos, Asteroinds, Jumpgates and so on.
 * @param  {Mesh} Mesh   The Mesh of the Labeled Object
 * @param  {OBJECT.Types} Type   The Type of the Object
 * @param  {Scene} Scene  The main scene
 * @param  {Camera} Camera The main camera
 * @param  {Engine} Engine The main engine
 * @return {SpaceTag Scope}      The created SpaceTag
 */
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
      "Approach": "approach",
      "Cicle": {
        "5km": "cicle:5",
        "10km": "cicle:10",
        "20km": "cicle:20",
        "50km": "cicle:50",
        "100km": {
          "more": "cicle:m",
          "much more": "cicle:mm",
          "even more": "cicle:em",
          "com on dude!": "cicle:cod"
        }
      },
      "Keep in distance": {
        "5km": "keep:5",
        "10km": "keep:10",
        "20km": "keep:20",
        "50km": "keep:50",
        "100km": "keep:100"
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

/**
 * Gibt an ob ein Knoten einem anderen untergeordnet ist.
 * @param  {DOMElement}  child   Possible Child Node
 * @param  {DOMElement}  parent Wana be Parent node
 * @return {Boolean}        True == Is a child node, False = Is no child of this parent
 */
function isChildOf(child, parent) {
  var parentNode = child.parentNode;
  while(parentNode != null) {
    if (parentNode == parent) return true;
    parentNode = parentNode.parentNode;
  }
  return false;
};

var CurrentContextMenu = null;
/*****************************************************************************************************************************
 * Openes a new context menu
 * @param  {Integer} X     Open Position X
 * @param  {Integer} Y     Open Position Y
 * @param  {UI.getMenus} Items  Menu Items of that Point
 * @return {ContextMenu Scope}       The newly created ContextMenu
 */
var ContextMenu = function(X, Y, Items, wsConnection) {
  if (CurrentContextMenu) CurrentContextMenu.kill();

  this.wsConnection = wsConnection;

  this.MenuEle = document.createElement('div');
  this.MenuEle.className = 'context-menu';
  document.body.appendChild(this.MenuEle);

  this.right2left = X > (window.innerWidth / 2);
  this.bottom2top = Y > (window.innerHeight / 2);

  if (this.right2left) {
    this.MenuEle.style.right = (window.innerWidth - X) + 'px';
    this.MenuEle.classList.add('r2l');
  } else {
    this.MenuEle.style.left = X + 'px';
    this.MenuEle.classList.add('l2r');
  }

  if (this.bottom2top) {
    this.MenuEle.style.bottom = (window.innerHeight - Y) + 'px';
    this.MenuEle.classList.add('b2t');
  } else {
    this.MenuEle.style.top = Y + 'px';
    this.MenuEle.classList.add('t2b');
  }

  var addItem = function(parent, Label, Data) {
    var NewItem = document.createElement('div');
    NewItem.className = 'context-menu-item';
    NewItem.innerText = Label;
    parent.appendChild(NewItem);
    if (Data instanceof Object) {
      var subMenuIcon = document.createElement('img');
      subMenuIcon.className = 'context-menu-sub-menu-icon';
      if (this.right2left)
        subMenuIcon.src = "../images/icons/sub-menu_l.png";
      else
        subMenuIcon.src = "../images/icons/sub-menu_r.png";
      NewItem.appendChild(subMenuIcon);
      var subMenu = document.createElement('div');
      subMenu.className = 'context-menu-sub-menu';
      NewItem.appendChild(subMenu);
      for (var Key in Data) {
        addItem(subMenu, Key, Data[Key]);
      }
    } else {
      NewItem.addEventListener('pointerdown', () => {
        this.wsConnection.send(Data);
        this.kill();
      });
    }
  }.bind(this);

  if (Items.length == 1) {
    for(var Key in Items[0]) {
      if (Key != "_Name_") {
        addItem(this.MenuEle, Key, Items[0][Key]);
      }
    }
  } else if (Items.length > 1) {
    for(var Itm of Items) {
      addItem(this.MenuEle, Itm['_Name_'], Itm);
    }
  }

  this.kill = function() {
    this.MenuEle.parentNode.removeChild(this.MenuEle);
    CurrentContextMenu = null;
  }.bind(this);

  var GlobalClickHandler = function(e) {
    if (isChildOf(e.srcElement, this.MenuEle)) {

    } else {
      this.kill();
    }
  }.bind(this);
  window.addEventListener('pointerdown', GlobalClickHandler);

  CurrentContextMenu = this;
};

/*****************************************************************************************************************************
 * Create a new game UI
 * @param  {babylon canvas} canvas the game canvas
 * @return {Ui Scope}        The newly generated game ui
 */
exports.Ui = function(canvas, wsConnection) {
  this.spaceTags = [];
  this.wsConnection = wsConnection;

  this.update = function(frustumPlanes) {
    for (var sT of this.spaceTags) {
      sT.update(frustumPlanes);
    }
  }.bind(this);

  var DocumentClickHandler = function(e) {
    if (e.button == 2) {
      var Menus = this.getMenus(e.clientX, e.clientY);
      if (Menus.length > 0) {
        var CM = new ContextMenu(e.clientX, e.clientY, Menus, wsConnection);
      }
    }
  }.bind(this);
  window.addEventListener('pointerdown', DocumentClickHandler);
  //canvas.addEventListener('mousedown', DocumentClickHandler);

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
