const Phaser = require('phaser');
const Utils = require('./utils.js');
const {
  LifeStructure
} = Utils;

const WIDTH = 300;
const HEIGHT = 200;
const SIZE = 4;

var PreDefinedPoints = [
  new LifeStructure(20, 80, [
    "                        #",
    "                      # #",
    "            ##      ##            ##",
    "           #   #    ##            ##",
    "##        #     #   ##   ",
    "##        #   # ##    # #",
    "          #     #       #",
    "           #   #         ",
    "            ##           "
  ]),
  new LifeStructure(-150, 100, [
    " ##",
    "##",
    " #"
  ]),
  new LifeStructure(-250, 100, [
    "###",
    "# #",
    "# #",
    "",
    "# #",
    "# #",
    "###"
  ])
];

var rnd = function(x, y) {
  if (x == 11 && y == 11)
    var i = 0;
  if (PreDefinedPoints.length <= 0) {
    return ((Math.round(Math.random() * 1000) % 3) == 0 ? 1 : 0);
  } else {
    for (var LS of PreDefinedPoints) {
      var result = LS.getState(x, y);
      if (result == 1) return result;
    }
    return 0;
  }
};

var config = {
  type: Phaser.AUTO,
  width: WIDTH * SIZE,
  height: HEIGHT * SIZE,
  parent: 'gol',
  scene: {
    create: create,
    update: update
  }
};

var graphics;
var game = new Phaser.Game(config);

var Fields = [];

function isCellAlive(X, Y) {
  while (X < 0) X += WIDTH;
  if (X >= WIDTH) X = X % WIDTH;
  while (Y < 0) Y += HEIGHT;
  if (Y >= HEIGHT) Y = Y % HEIGHT;
  return Fields[X][Y].state == 1;
}

function sumNeighbors(X, Y) {
  var Vectors = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ];

  var sum = 0;
  for (var Vect of Vectors) {
    var [nX, nY] = Vect;
    if (isCellAlive(X + nX, Y + nY)) sum += 1;
  }

  return sum;
};

function create() {
  graphics = this.add.graphics({
    fillStyle: {
      color: 0xA7EFFF
    }
  });

  for (var x = 0; x < WIDTH; x++) {
    var Row = [];
    for (var y = 0; y < HEIGHT; y++) {
      var rect = new Phaser.Geom.Ellipse(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
      var LiveState = rnd(x, y);
      Row.push({
        state: LiveState,
        next: LiveState,
        rect: rect
      });
    }
    console.log('' + Row.length);
    Fields.push(Row);
  }
}

function update() {
  for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {
      var n = sumNeighbors(x, y);
      cell = Fields[x][y];
      if ((cell.state == 0) && n == 3) {
        cell.next = 1;
      } else if ((cell.state == 1) && (n < 2)) {
        cell.next = 0;
      } else if ((cell.state == 1) && (n > 3)) {
        cell.next = 0;
      }
    }
  }

  graphics.clear();
  for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {
      Fields[x][y].state = Fields[x][y].next;
      if (Fields[x][y].state) {
        graphics.fillEllipseShape(Fields[x][y].rect);
      }
    }
  }
}
