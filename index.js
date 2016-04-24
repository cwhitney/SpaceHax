var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

var rooms = [];

function room(roomSocket, roomId){
	this.roomSocket = roomSocket;
	this.roomId = roomId;
	this.mobileSockets = [];
};

// app.use(express.methodOverride());
// app.use(express.bodyParser());
// app.use(app.router);
app.use(express.static(__dirname + '/public'));


app.get(/.+/, function(req, res){
	var ua = req.headers['user-agent'];
	if(/mobile/i.test(ua)) {
		res.sendFile(__dirname + '/public/index.html');
	}else{
		res.sendFile(__dirname + '/public/index.html');
	}	
});

io.on('connection', function(socket){
	// console.log('a user connected ');

 	socket.on('desktopClient', function(data){

 		console.log("Desktop client connected :: id " + socket.id );

	    // find room
	    var desktopRoom = null;
	    for(var i = 0; i < rooms.length; i++){
			if(rooms[i].roomId == data.id){
				desktopRoom = i;
				break;
			}
		}

	    if(data.command == 'register'){
			if(desktopRoom == null){
				console.log('Creating new desktop room :: ' +  data.id);
				socket.spaceId = data.id;
				socket.isOwner = true;
				socket.isMobile = false;
				rooms.push(new room(socket, data.id));
			}
		}else if(data.command == 'launch'){
			console.log("Got launch command for :: " + data.id + " :: " + rooms[desktopRoom].mobileSockets.length);
			for( var i=0; i<rooms[desktopRoom].mobileSockets.length; i++){
				rooms[desktopRoom].mobileSockets[i].emit('launch', 1);
			}
		}else if(data.command == 'reset'){
			console.log("Got reset command for :: " + data.id + " :: " + rooms[desktopRoom].mobileSockets.length);
			for( var i=0; i<rooms[desktopRoom].mobileSockets.length; i++){
				rooms[desktopRoom].mobileSockets[i].emit('reset', 1);
			}
		}
	});

	socket.on('mobileClient', function(data){
	    console.log("Mobile client connected :: id " + socket.id );

	    if( data.command == 'register' ){
		    var desktopRoom = null;
		    for(var i = 0; i < rooms.length; i++){
				if(rooms[i].roomId == data.id){
					desktopRoom = i;
					socket.isMobile = true;
					socket.spaceId = data.id;
					rooms[desktopRoom].mobileSockets.push(socket);
					socket.emit('reset', 1);
					break;
				}
			}
		}else{
			// they tried to register a room that doesn't exist
			console.log("Mobile tried to register the non-existant room " + data.id);
		}
	});

	socket.on('disconnect', function() {

		if( socket.isMobile == true){
			var rID = getRoomID(socket.spaceId);
			for( var i=0; i<rooms[rID].mobileSockets.length; i++){
				if( rooms[rID].mobileSockets[i].id == socket.id ){
					rooms[rID].mobileSockets.splice(i, 1);
					console.log("Removing mobile socket :: " + socket.spaceId);
				}
			}
		}

		// remove this broadcast from the list
	    if( socket.isMobile == false && socket.isOwner != null && socket.spaceId != null ){
	    	for(var i = 0; i < rooms.length; i++){
		    	if(rooms[i].roomId == socket.spaceId){
					desktopRoom = i;
					rooms.splice(desktopRoom, 1);
					console.log("Closing room :: " + socket.spaceId);
					break;
				}
			}
	    }
	});

	function getRoomID( roomName ){
		for(var i = 0; i < rooms.length; i++){
	    	if(rooms[i].roomId == roomName){
	    		return i;
	    	}
	    }
	    return null;
	}

});

http.listen(port, function(){
	console.log('listening on *:' + port);
});