yp.scripts.communication = function() {

const host = 'localhost';
const port = 55501;

if(yp.comm && yp.comm.websocket) {
	yp.comm.websocket.close();
}

const comm = {};
yp.comm = comm;

comm.websocket = null;

let close_expected = false;

let set_button = function(info, disabled) {
	document.getElementById("comm-button").innerHTML = info;
	document.getElementById("comm-button").disabled = disabled;
};
let set_info = function(info) {
	document.getElementById("comm-info").innerHTML = info;
};
set_info("Not currently connected to bot.");
set_button("Connect", false);


let handle_request = function(request) {
	//console.log(request);
	let response = { type: 'response', rid: request.rid }
	let data = {}
	if(request.data.f === "song") {
		data = yp.player.get_cur_info();
		data.tags = Array.from(data.tags);
		let alternative = yp.player.get_cur_alternative();
		data.url = alternative.id;
	}
	response.data = data
	comm.websocket.send(JSON.stringify(response));
	//console.log("sent: " + JSON.stringify(response))
};

let handle_send = function(message) {
	//console.log(message);
	if(message.data.f === "close") {
		const reason = message.data.reason;
		const reasons = {
			"SERVER_CLOSE": "Disconnect: The server closed the connection.",
			"SERVER_RESTART": "Disconnect: The server was restarted.",
			"SERVER_SHUTDOWN": "Disconnect: The server was shut down.",
			"TOO_MANY_CONNECTIONS": "Refused: Server is connected to another client.",
		}
		if(reason in reasons) {
			set_info(reasons[reason]);
		}
		else {
			set_info("Server closed for unknown reason: " +  reason);
		}
		close_expected = true;
	}
	if(message.data.f === "say") {
		console.log("They say: " + message.data.message);
	}
};


let onopen = function(event) {
	set_info("Connected!");
	set_button("Disconnect", false);
};
let onerror = function(event) {
	//console.log(event);
	set_info("Could not establish a connection.");
	close_expected = true;
	comm.websocket = null;
};
let onmessage = function (event) {
	let message = JSON.parse(event.data);
	if(message && message.type) {
		switch(message.type) {
			case "get":
				handle_request(message);
				return;
			case "give":
				handle_send(message);
				return;
		}
	}
	console.warn("Websocket got a message it didn't know how to handle:");
	console.warn(message);
};
let onclose = function (event) {
	if(!close_expected) {
		set_info("Server disconnected unexpectedly.");
	}
	set_button("Connect", false);
	close_expected = false;
};

comm.connect = function() {
	comm.websocket = new WebSocket("ws://" + host + ":" + port);
	comm.websocket.onopen = onopen;
	comm.websocket.onerror = onerror;
	comm.websocket.onmessage = onmessage;
	comm.websocket.onclose = onclose;
	set_info("Connecting...");
	set_button("Connecting", true);
};

comm.disconnect = function() {
	if(comm.websocket && comm.websocket.readyState !== WebSocket.OPEN) {
		throw 'Cannot disconnect an unconnected websocket.';
	}
	close_expected = true;
	set_info("Not currently connected to bot.");
	comm.websocket.close();
};

comm.onbutton = function() {
	if(!comm.websocket || comm.websocket.readyState === WebSocket.CLOSED) {
		comm.connect();
	}
	else if(comm.websocket && comm.websocket.readyState === WebSocket.OPEN) {
		comm.disconnect();
	}
};


};