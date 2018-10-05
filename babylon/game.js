
exports.Game = function(engine, scene, ui) {
  this.connection = new WebSocket('ws://127.0.0.1:1337');
  this.engine = engine;
  this.scene = scene;
  this.ui = ui;

  this.on = function(event, callback) {
    switch (event) {
      case 'open':
          OpenCallbacks.push(callback);
        break;
      case 'error':
          ErrorCallbacks.push(callback);
        break;
    }
  };

  var OpenCallbacks = [];
  this.connection.onopen = function () {
    console.log('connection open');
    for(var cb of OpenCallbacks) {
      cb();
    }
  }.bind(this);

  var ErrorCallbacks = [];
  this.connection.onerror = function (error) {
    console.log('ws error: ' + JSON.stringify(error));
    for(var cb of ErrorCallbacks) {
      cb();
    }
  }.bind(this);

  this.connection.onmessage = function (message) {
    console.log(message);
    try {
      var msg = JSON.parse(message.data);
      switch (msg.a) {
        case 'login':
            this.ui.setLoginScreen(msg.d);
          break;
        case 'charSelect':
            this.ui.setCharSelect(msg.d);
          break;
        case 'charCreate':
            this.ui.setCreateCharScreen(msg.d);
          break;
        case 'popup':
            this.ui.popup(msg.d);
          break;
      }
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
    }
  }.bind(this);

  this.send = function(Data) {
    this.connection.send(JSON.stringify(Data));
  }.bind(this);

  this.ui.setGame(this);
};
