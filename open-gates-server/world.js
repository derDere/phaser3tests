const fs = require('fs');

exports.startSystem = '62ba444e-38f0-438e-80a4-0b26c3e4eb1c';

exports.worldFolder = __dirname + '/world/';

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
