# Hooli logger server

<hr>
<br>
<p align="center">
  <img src="https://github.com/leganux/hooli-logger-server/blob/main/public/hooli.jpg?raw=true" width="550" title="APIATO logo">
</p>


<p align="justify">
A simple log aggregator tool for nodejs / express projects.

Behind the need to see and control the logs of applications and microservices based on express and NodeJS that run in
containers through serverless infrastructure from any provider, and with easy integration without complications and for
free.

The leganux team developed a set of tools that would solve these problems in a very simple way. The Hooli logger project
allows users of node/express projects to implement a fast, efficient and visual service that allows them to manage their
logs.

This service allows you to view, analyze, filter and obtain the context of:

* console.log
* console.info
* console.warn
* console.error
* console.debug
  *http requests

In real time and in a visual and managed way

<hr>

## How to use

**Configure ExpressJS basic project server**

First clone the server repository

```text
$ git clone "https://github.com/leganux/hooli-logger-server.git"
```

Install the dependences

```text
$ npm i
```

Modify Configuration Config.js

```javascript
module.exports = {
  log_rotate_cron: '0 * * * *', //indicates every time runs cron of log rotate
  log_rotate_hours: 12,//indicates delete data from 12 hour back
  listen_port: 3333,//Port wich run server
  db_flavor: 'sqlite', /* sqlite, mariadb, mysql*/
  db_host: 'localhost', //host server DB  of not sqlite
  db_port: '00000',//port DB  of not sqlite
  db_username: '',//username DB  of not sqlite
  db_password: '',//password DB  of not sqlite
  db_filename: 'my_db.sqlite', // only for sqlite
  db_name: 'hooli', //  for all databases
  user: 'hooli', // Coming soon login
  password: 'CFm7AWR3tezcuyBg', // Coming soon login
}
```

Run server

```text
$ node app.js
```

Visit website

```text
https://myhostdomain.com:3333/web
```

**Configure Client in your node project**

Install package

```text
npm i hooli-logger-client
```

Import package

```javascript
let hooli = require("hooli-logger-client")
```

New instance declaration

```javascript
let logger = new hooli('https://myhostdomain.com:3333', 'The name of your APP', 'The source. EG. ID container or Environment')
```

Replacing default log functions from NodeJS console

```javascript
const _privateLog = console.log;
const _privateError = console.error;
const _privateInfo = console.info;
const _privateWarn = console.warn;
const _privateDebug = console.debug;

console.log = async function (message) {
  _privateLog.apply(console, arguments);
  logger.log(arguments)

};
console.error = async function (message) {
  _privateError.apply(console, arguments);
  logger.error(arguments)
};
console.info = async function (message) {
  _privateInfo.apply(console, arguments);
  logger.info(arguments)
};
console.warn = async function (message) {
  _privateWarn.apply(console, arguments);
  logger.warn(arguments)
};
console.debug = async function (message) {

  _privateDebug.apply(console, arguments);
  logger.debug(arguments)

};

```

For requests install Morgan Middleware in express

```text
npm i morgan
```

```javascript
let morgan = require('morgan')

app.use(morgan(function (tokens, req, res) {

  let cadenamorgan = [
    moment().format('YYYY-MM-DD hh:mm:ss'),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms'
  ].join('  ');

  /*  Implement request logger  */
  logger.request(JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    body: req.body,
    query: req.query,
    params: req.params,
  }))

  return cadenamorgan;
}));

```

## And that's all folks

<p align="center">
    <img src="https://leganux.net/web/wp-content/uploads/2020/01/circullogo.png" width="100" title="hover text">
    <br>
  Hooli logger is another project of  <a href="https://leganux.net">leganux.net</a> &copy; 2021 all rights reserved
    <br>
   This project is distributed under the MIT license. 
    <br>

<br>
<br>
The logo and the name of Hooli logger is inspired by the name of hooli, the fictional company  from the HBO series, Silicon Valley. This inspiration was taken for fun purposes only. The original name and logo reserve their rights to their original creators. 
</p>


