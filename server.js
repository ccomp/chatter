//http portion
var http = require('http');
var fs = require('fs'); //using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

var people = {};

function requestHandler(req, res) {
    var parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);

	fs.readFile(__dirname + parsedUrl.pathname,
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	   //This is where everything happens
	//This is where we listen for and send messages

		console.log("We have a new client: " + socket.id);
		people[socket.id] = "anonymous";
		
		// keep track of what socket id contains their name

		socket.on("join", function(name) {
			people[socket.id] = name;
			console.log(people[socket.id]);
			console.log(name + " has joined the chat!");
		});

		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(data) 
		{

			// Data comes in as whatever was sent, including objects
			console.log("Received: 'chatmessage' " + data);
			
			// Send it to all of the clients

			socket.emit('update', people[socket.id]);
			socket.broadcast.emit('chatmessage', data);
		});
		
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);
