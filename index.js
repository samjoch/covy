
var fs = require('fs');
var path = require('path');

var mocha = require('mocha');
GLOBAL.sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
GLOBAL.expect = chai.expect;

var Covy = function(options) {
  options = options || {};
  this.blanketOptions = options.blanket;
  this.path = options.path;
  this.ext = options.ext || '.test.js';
  this.mocha = new mocha({
    reporter: process.env['REPORTER'] || options.reporter || 'nyan',
    grep: process.env['GREP'] || options.grep,
    ui: process.env['UI'] || options.ui || 'bdd',
    growl: true
  });
  this.blanket();
  this.files();
  this.run();
};

Covy.prototype = {
  blanket: function() {
    var blanket = require('blanket')(this.blanketOptions);
  },
  files: function() {
    var files = fs.readdirSync(this.path).filter(function(f) {
      return f.substr(~this.ext.length + 1) === this.ext;
    }.bind(this));
    files.forEach(function(file) {
      file = path.join(this.path, file);
      this.mocha.addFile(file);
    }.bind(this));
  },
  run: function() {
    this.mocha.run(function(failures) {
      process.exit(failures);
    });
  }
};

module.exports = Covy;

