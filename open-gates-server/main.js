const WEBSOCKET = require('websocket');
const HTTP = require('http');

var httpServer = HTTP.createServer();
httpServer.listen(1337, () => {});

var wsServer = new WEBSOCKET.server({
  httpServer: httpServer
});

var sessions = [];

var Session = function (connection) {
  console.log('New Client');
  this.connection = connection;
  this.login = false;

  var MessageHandler = function(message) {
    if (message.type === 'utf8') {
      var obj = JSON.parse(message.utf8Data);
      console.log(JSON.stringify(obj));
      if (this.login) {

      } else {

      }
    }
  }.bind(this);

  var CloseHandler = function(connection) {
    var index = sessions.indexOf(this);
    if (index != -1)
      sessions.splice(index, 1);
    console.log(`bye bye ${index}`);
  }.bind(this);

  this.connection.on('message', MessageHandler);
  this.connection.on('close', CloseHandler);
};

wsServer.on('request', (webSocketRequest) => {
  sessions.push(new Session(webSocketRequest.accept(null, webSocketRequest.origin)));
});
