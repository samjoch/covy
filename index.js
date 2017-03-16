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
global.sinon = require('sinon');
var chai = global.chai = require('chai');

var sinonChai = global.sinonChai = require('sinon-chai');
chai.use(sinonChai);

global.expect = chai.expect;

//
// Declare Covy
//
function Covy (options) {
  EventEmitter.call(this);
  options = options || {};

  this.options = {
    path: options.path || path.join(process.cwd(), 'test'),
    ext: process.env['EXT'] || options.ext || '.test.js',
    reporter: process.env['REPORTER'] || options.reporter || 'nyan',
    grep: process.env['GREP'] || options.grep,
    ui: process.env['UI'] || options.ui || 'bdd',
    onEndExit: options.onEndExit || true
  };

  this.mocha = new Mocha({
    reporter: this.options.reporter,
    grep: this.options.grep,
    ui: this.options.ui
  });

  this.files()
    .forEach(this.mocha.addFile.bind(this.mocha));

  this.run();
}

inherits(Covy, EventEmitter);

Covy.prototype.files = function files () {
  return fs.readdirSync(this.options.path)
    .filter(function (f) {
      return f.substr(~this.options.ext.length + 1) === this.options.ext;
    }.bind(this))
    .map(function (file) {
      return path.join(this.options.path, file);
    }.bind(this));
};

Covy.prototype.run = function run () {
  this.mocha.run(function (failures) {
    if (!process.stdout.bufferSize) {
      this._end(failures);
    } else {
      process.stdout.on('drain', this._end.bind(this, failures));
    }
  }.bind(this));
};

Covy.prototype._end = function _end (failures) {
  this.emit('end', failures);
  if (this.options.onEndExit) { process.exit(failures); }
};

module.exports = Covy;
