var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config();

const routerUsers = require('./routes/users.route');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB CONNECTED'))
  .catch(err => console.log(err.message));

app.use('/api', routerUsers);

// Obtén el puerto de las variables de entorno y almacénalo en Express.
var port = 4000;
app.set('port', port);

// Crear servidor HTTP.
var http = require('http');
var server = http.createServer(app);

// Escuchar en el puerto proporcionado, en todas las interfaces de red.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Manejar errores específicos con mensajes amigables
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log(`Listening on ${bind}`);
}

module.exports = app;
