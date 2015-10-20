<div align="center">
  <img src="http://i.imgur.com/jmjPV6W.png">
</div>
<br>
[![](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com)
[![](https://img.shields.io/travis/kratos/kratos/develop.svg)](https://travis-ci.org/kratos/kratos) [![](https://img.shields.io/coveralls/kratos/kratos/develop.svg)](https://coveralls.io/github/kratos/kratos)
[![](https://img.shields.io/npm/v/kratos.svg)](https://www.npmjs.com/package/kratos)
[![](https://img.shields.io/npm/dm/kratos.svg)](https://www.npmjs.com/package/kratos)
[![](https://img.shields.io/npm/l/kratos.svg)](https://www.npmjs.com/package/kratos)

<p align="center">
  <strong><a href="#about">About</a></strong>
  |
  <strong><a href="#getting-started">Getting Started</a></strong>
  |
  <strong><a href="#docs">Documentation</a></strong>
  |
  <strong><a href="#license">License</a></strong>
  |
  <strong><a href="CONTRIBUTING.md">Contributing</a></strong>
</p>
<br>
## About

_Kratos_ is a modern framework for building web applications on [Node.js](http://nodejs.org) based on up-to-date ES6 features from V8.

_Kratos_ does require the use of Node.js `v4.0.0` or later.

## Getting Started

### Install

```
$ npm install kratos --save
```

### Basic Kratos Application

```js
'use strict'

const kratos = require('kratos')
const app = kratos()

app.get('/', function * () {
  this.body = 'Hello, World!'
})

app.run()
```

### Start Application

```
$ node app.js

Kratos Application started on http://0.0.0.0:1337 in development mode.
```

## Documentation

Currently we're lacking documentation and plan to write some here soon. Please be patient.

## License

[MIT](LICENSE) &copy; [Viracore](https://www.viracore.com) & [Contributors](../../graphs/contributors).
