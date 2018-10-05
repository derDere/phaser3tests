const WEBSOCKET = require('websocket');
const HTTP = require('http');
const WORLD = require('./world.js');

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
  this.char = null;
  this.account = null;

  this.send = function(Data) {
    this.connection.send(JSON.stringify(Data));
  }.bind(this);

  var MessageHandler = function(message) {
    if (message.type === 'utf8') {
      var obj = JSON.parse(message.utf8Data);
      console.log(JSON.stringify(obj));
      if (!this.login) {
        if (obj.c == 'login') {
          WORLD.loadAccount(obj.d[0], obj.d[1], (success, data) => {
            if (success) {
              this.login = true;
              this.account = data;
              this.send({a:'login',d:0});
              this.send({a:'charSelect',d:{chars:this.account.charObjs,create:(this.account.chars.length < 3)}});
            } else {
              this.send(data);
            }
          });
        }
      } else if (this.char == null) {
        if ((obj.c == 'newChar') && (this.account.chars.length < 3)) {
          this.send({a:'charSelect',d:0});
          this.send({a:'charCreate',d:1});
        }
        if ((obj.c == 'createNewChar') && (this.account.chars.length < 3)) {
          WORLD.createNewChar(this.account, obj.d, (err) => {
            if (err) {
              this.send(err);
            } else {
              this.send({a:'charSelect',d:{chars:this.account.charObjs,create:(this.account.chars.length < 3)}});
              this.send({a:'charCreate',d:0});
            }
          });
        }
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
