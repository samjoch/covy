//
// load core modules
//
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events');
var inherits = require('util').inherits;

//
// load third-party modules
//
var Mocha = require('mocha');

//
// register global variables
//
GLOBAL.sinon = require('sinon');
var chai = GLOBAL.chai = require('chai');

var sinonChai = GLOBAL.sinonChai = require('sinon-chai');
chai.use(sinonChai);

GLOBAL.expect = chai.expect;

//
// Declare Covy
//
function Covy (options) {
  EventEmitter.call(this);
  options = options || {};
  options.mocha = options.mocha || {};

  this.blanketOptions = options.blanket;
  this.path = options.path;
  this.ext = options.ext || '.test.js';

  options.mocha.reporter = options.mocha.reporter || 'nyan';
  options.mocha.ui = options.mocha.ui || 'bdd';

  this.mocha = new Mocha(options.mocha);

  if (options.force_cov || this.mocha.options.reporter.match('cov')) {
    this.blanket();
  }

  this.files()
    .forEach(this.mocha.addFile.bind(this.mocha));

  this.run();
}

inherits(Covy, EventEmitter);

Covy.prototype.blanket = function blanket () {
  return require('blanket')(this.blanketOptions);
};

Covy.prototype.files = function files () {
  return fs.readdirSync(this.path)
    .filter(function (f) {
      return f.substr(~this.ext.length + 1) === this.ext;
    }.bind(this))
    .map(function (file) {
      return path.join(this.path, file);
    }.bind(this));
};

Covy.prototype.run = function run () {
  this.mocha.run(function (failures) {
    if (!process.stdout.bufferSize) {
      this.emit('end', failures);
    } else {
      process.stdout.on('drain', function () {
        this.emit('end', failures);
      }.bind(this));
    }
  }.bind(this));
};

module.exports = Covy;
