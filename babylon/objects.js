const spaceship = require('./spaceship.js');
const utils = require('./utils.js');
const planet = require('./planet.js');
const skybox = require('./skybox.js');
const ui = require('./ui.js');
const game = require('./game.js');

exports.Planet = planet.Planet;
exports.FreeCam = utils.FreeCam;
exports.SpaceCam = utils.SpaceCam;
exports.SpaceShip = spaceship.SpaceShip;
exports.SkyBox = skybox.SkyBox;
exports.Ui = ui.Ui;
exports.SpaceTag = ui.SpaceTag;
exports.Game = game.Game;

exports.Types = new (function() {
  this.PLANET =     {id:0, icon:'planet'},
  this.JUMP_GATE =  {id:1, icon:'jump_gate'},
  this.ASTEROID_0 = {id:2, icon:'asteroid_0'},
  this.ASTEROID_1 = {id:3, icon:'asteroid_1'},
  this.LOCKED =     {id:4, icon:'locked'},
  this.LOOT_0 =     {id:5, icon:'loot_0'},
  this.LOOT_1 =     {id:6, icon:'loot_1'},
  this.STATION =    {id:7, icon:'station'},
  this.SUN =        {id:8, icon:'sun'},
  this.TARGET =     {id:9, icon:'target'}

  this.items = [
    this.PLANET,
    this.JUMP_GATE,
    this.ASTEROID_0,
    this.ASTEROID_1,
    this.LOCKED,
    this.LOOT_0,
    this.LOOT_1,
    this.STATION,
    this.SUN,
    this.TARGET,
  ];
})();
