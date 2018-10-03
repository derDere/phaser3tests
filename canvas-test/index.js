const WIDTH = 100;
const HEIGHT = 100;
const SIZE = 8;

//https://de.wikipedia.org/wiki/Malbolge

function rnd(x, y) {
  var R = (Math.round(Math.random() * 1000) % 3) == 0;
  return R ? 1 : 0;
}

function rndC(x, y) {
  var colors = [
    "#7F00FF",
    "#007FFF",
    "#7FFF00",
    "#FF7F00",
    "#7F007F",
    "#FFFF00",
    "#FF007F",
    "#007F00",
    "#FF0000"
  ];
  var I = Math.floor(Math.random() * 1000000) % colors.length;
  return colors[I];
}

function createCompleteTable(H, B) {
  var table = [];
  for (var y = 0; y < H; y++) {
    var row = [];
    for (var x = 0; x < B; x++) {
      row.push({
        lives: rnd(x, y),
        color: rndC()
      });
    }
    table.push(row);
  }
  return table;
}

var myTable;

function create() {
  myTable = createCompleteTable(WIDTH, HEIGHT);

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = "#FFFFFF";

  update();
}

function update() {
  for (var y = 0; y < myTable.length; y++) {
    for (var x = 0; x < myTable[y].length; x++) {
      var cell = myTable[y][x];
      cell.lives = rnd(x, y);
    }
  }
  draw();
}

function draw() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, SIZE * WIDTH, SIZE * HEIGHT);
  ctx.globalAlpha = 1;

  for (var y = 0; y < myTable.length; y++) {
    for (var x = 0; x < myTable[y].length; x++) {
      var cell = myTable[y][x];
      ctx.fillStyle = cell.color;
      if (cell.lives)
        ctx.fillRect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
    }
  }

  setTimeout(update, 100);
}

create();
