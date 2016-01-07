Covy
----

Covy configures a test environment using Mocha, Chai, Sinon & Blanket

## Installation

```shell
npm install covy
```

## Getting started

By default `mocha` use a `./test` directory, so you should have one.

Then create a `index.js`:

```javascript
var Covy = require('covy');

new Covy({
  path: __dirname,
  blanket: {
    'data-cover-never': 'node_modules',
    'spec-cov': {
      threshold: 15,
      localThreshold: 15
    },
    pattern: [
      'server.js',
      'lib',
      // others files/directories you want to code coverage.
    ]
  }
});
```

then add those scripts in your `package.json`:

```json
"scripts:" {
  "test": "node test/index.js",
  "cov": "REPORTER=html-cov node test/index.js > cov.html && open cov.html"
}
```

