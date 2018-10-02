const WEBSOCKET = require('websocket');
const HTTP = require('http');

var httpServer = HTTP.createServer();
httpServer.listen(1337, () => {});

var wsServer = new WEBSOCKET.server({
  httpServer: httpServer
});

wsServer.on('request', (webSocketRequest) => {
  var connection = webSocketRequest.accept(null, webSocketRequest.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log(message);
    }
  });

  connection.on('close', function(connection) {
    console.log('bye bye');
  });
});
