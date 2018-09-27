

function createCompleteTable (H, B) {
  var table = [];
  for (var y = 0; y < H; y++) {
    var row = [];
    for(var x = 0; x < B; x++) {
      var L = ((x+y) % 5)==0;
      row.push({lives:L, w:8, h:8});
    }
    table.push(row);
  }
  return table;
}


function draw() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  var myTable = createCompleteTable(100,100);

  ctx.fillStyle="#007FFF";

  for (var y = 0; y < myTable.length; y++) {
    for (var x = 0; x < myTable[y].length; x++) {
      var cell = myTable[y][x];
      if (cell.lives)
        ctx.fillRect(x * cell.w, y * cell.h, cell.w - 1, cell.h - 1);
    }
  }
}

draw();
