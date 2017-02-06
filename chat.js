
var socket = io.connect();
var speaker = "anonymous";
var current = "anonymous";

//gives feedback whenever a connection is established
socket.on('connect', function()
{
	console.log("Connected");
});


socket.on('update', function(name)
{
	console.log(name);
	speaker = name;
});

// Receive from any event - this is received from the server's broadcast.emit
socket.on('chatmessage', function (data)
{
	console.log(data);
	packager(data, "left");
});


var sendmessage = function(message)
{
	if (message != "") {
	    //print to browser console the event that is occurring
		console.log("chatmessage: " + message);
	    //emit this event to the server
		socket.emit('chatmessage', message);
		packager(message, "right");
		document.getElementById('speak').value = "";
	}
};

function setName(value)
{
	if (value != "") 
	{
		console.log("set name: " + value);
		current = value;
		socket.emit("join", value);
		document.getElementById('namer').value = "";
	}
}

function packager(message, direction)
{

	//this function takes in the message and formats it according to the message_template
	clean(document);
	console.log(message);
	var x = document.getElementById("template");
	var duped = x.cloneNode(true);
	var element = duped.firstChild;
	var dupeList = element.childNodes;
	for (var i = 0; i < dupeList.length; i++) 
	{
		if (dupeList[i].className == "screenName")
		{
			if (direction == "right") dupeList[i].innerHTML = current;
			else dupeList[i].innerHTML = speaker;
		} else if (dupeList[i].className == "text_wrapper")
		{
			var y = dupeList[i].firstChild;
			y.innerHTML = message;
		}
	}
	element.className += (" " + direction + " appeared");

	var messager = document.getElementById('messager');
	messager.appendChild(element);
	speaker = "anonymous";
}

function clean(node)
{
	//this cleans up the whitespace in the document for easier parsing
  for(var n = 0; n < node.childNodes.length; n ++)
  {
    var child = node.childNodes[n];
    if
    (
      child.nodeType === 8 
      || 
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    )
    {
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1)
    {
      clean(child);
    }
  }
}

var msg = document.getElementById('speak');
msg.onkeydown = function(e)
{
	if (e.keyCode == 13) sendmessage(msg.value);
};