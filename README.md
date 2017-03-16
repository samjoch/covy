Covy
----

Covy configures a test environment using Mocha, Chai, Sinon & Istanbul

## Installation

```shell
npm install covy
```

## Getting started

`covy` use the `./test` directory and search for all `.test.js` files.

Add those scripts in your `package.json`:

```json
"scripts:" {
  "test": "covy",
  "cov": "istanbul cov ./node_modules/.bin/covy"
}
```
