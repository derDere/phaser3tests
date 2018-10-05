const fs = require('fs');
const md5 = require('md5');
const async = require("async");

exports.startSystem = '62ba444e-38f0-438e-80a4-0b26c3e4eb1c';

exports.worldFolder = __dirname + '/world/';
exports.accountFolder = __dirname + '/accounts/';
exports.charsFolder = __dirname + '/chars/';

exports.saveAccount = function(account) {
  var AccData = Object.assign({}, account);

  //Removing Char Objects
  delete AccData.charObjs;

  fs.writeFile(exports.accountFolder + AccData.Username + '.json', JSON.stringify(AccData, null, 2), (err) => {
    if(err) console.log(JSON.stringify(err));
  });
};

exports.createNewChar = function(account, Data, callback) {
  var charData = {
    name: Data
  };
  fs.writeFile(exports.charsFolder + Data + '.json', JSON.stringify(charData, null, 2), {flag:'wx'}, (err) => {
    if (err) {
      if(err.code == "EEXIST") {
        callback({a:'popup',d:['This character name allready exists!']});  
      } else {
        console.log(JSON.stringify(err));
      }
    } else {
      account.chars.push(charData.name);
      account.charObjs.push(charData);
      exports.saveAccount(account);
      callback(false);
    }
  });
};

var loadCharAsync = function(char, callback) {
  fs.readFile(exports.charsFolder + char + '.json', callback);
};

var loadChars = function(chars, callback) {
  async.map(chars, loadCharAsync, (err, results) => {
    if (err) {
      callback([]);
    } else {
      var chars = [];
      for (var fileData of results) {
        chars.push(JSON.parse(fileData));
      }
      callback(chars);
    }
  });
};

var loginHash = function(Username, Password) {
  return md5(Password + Username + Password);
};

exports.loadAccount = function(Username, Password, callback) {
  var liHash = loginHash(Username, Password);
  fs.readFile(exports.accountFolder + Username + '.json', (err, data) => {
    if (err) {
      callback(false, {a:'popup',d:['Login Failed!']});
    } else {
      var account = JSON.parse(data);
      if (account.liHash === liHash) {
        loadChars(account.chars, (charObjs) => {
          account.charObjs = charObjs;
          callback(true, account);
        })
      } else {
        callback(false, {a:'popup',d:['Login Failed!']});
      }
    }
  });
};

var LoadedObjects = {};

var LoadFrom = function(uuid, subFolder, callback) {
  if (uuid in LoadedObjects)
    callback(LoadedObjects[uuid]);
  else
    fs.readFile(exports.worldFolder + subFolder + uuid + '.json', (err, data) => {
      if (err)
        console.log(JSON.stringify(err));
      else {
        var jj = JSON.parse(data);
        LoadedObjects[uuid] = jj;
        callback(jj);
      }
    })
};

exports.systems = function(uuid, callback) {
  LoadFrom(uuid, 'systems/', callback);
};

exports.planets = function(uuid, callback) {
  LoadFrom(uuid, 'planets/', callback);
};

exports.stations = function(uuid, callback) {
  LoadFrom(uuid, 'stations/', callback);
};

exports.gates = function(uuid, callback) {
  LoadFrom(uuid, 'gates/', callback);
};

exports.asteroidBelts = function(uuid, callback) {
  LoadFrom(uuid, 'asteroidBelts/', callback);
};
