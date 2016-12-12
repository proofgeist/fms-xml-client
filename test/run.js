'use strict';
/**
 * test runner allows us to bootstrap with .env files
 */

require('dotenv').config({path: __dirname +'/.env'});


const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {

    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));

  });
  return filelist;
}


var Mocha = require('mocha'),
  fs = require('fs'),
  path = require('path');

// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = './test'

// Add each .js file to the mocha instance
walkSync(testDir).filter(function(file){
  // Only keep the .js files
  return file.substr(-3) === '.js';

}).forEach(function(file){
  mocha.addFile(file);
});

// Run the tests.
mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);  // exit with non-zero status if there were failures
  });
});