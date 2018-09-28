exports.LifeStructure = function(X, Y, Pattern) {
  this.points = [];

  this.getState = function(X, Y) {
    var Result = this.points.indexOf(`${X},${Y}`) != -1;
    return Result ? 1 : 0;
  }.bind(this);

  if (X < 0) return;

  for (var yP = 0; yP < Pattern.length; yP++) {
    for (var xP = 0; xP < Pattern[yP].length; xP++) {
      if (Pattern[yP][xP] != ' ') {
        this.points.push(`${xP+X},${yP+Y}`);
      }
    }
  }
};
