//inital set up for an express app

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var morgan = require('morgan');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
// Proper Logging Middleware
app.use(morgan('dev'));

//this links my files.
app.use(express.static(__dirname + '/public'));

Instagram = require('instagram-node-lib');

Instagram.set('client_id', INSTAGRAM_CLIENT_ID );
Instagram.set('client_secret', process.env.INSTAGRAM_SECRET);

Instagram.set('callback_url', 'http://1a31f669.ngrok.io/');

Instagram.set('maxSockets', 100);

//setting up the instagram realtime

Instagram.subscriptions.subscribe({ 
          object: 'tag',
          object_id: 'blue',
          aspect: 'media',
          callback_url: 'http://1a31f669.ngrok.io/subscribe',
          type: 'subscription',
          id: '#' });

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/subscribe', function(request, response){
  Instagram.subscriptions.handshake(request, response); 
});

app.post('/subscribe', function(request, response) {
  var data = request.body;
  io.sockets.emit('instagram', data);
  console.log(data);
});

server.listen(port, function() {
  console.log('Server started on http://localhost:' + port);
});

//now for the sockets

var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
    socket.emit('connected');
});


// http://3633f557.ngrok.io/


