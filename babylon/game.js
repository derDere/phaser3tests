
exports.Game = function(engine, scene, Ui) {
  this.connection = new WebSocket('ws://127.0.0.1:1337');

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
  }.bind(this);

  this.connection.onmessage = function (message) {
    console.log(message);
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
    }
  }.bind(this);
};
