var client;
$(function() {
    client = new Paho.MQTT.Client('test.mosquitto.org', 8080, "clientId");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
	client.connect( {onSuccess:onConnect});
});

function logIn(){
	var logInTopic = 'myim/chat/user/';
	var logInObj = {};
	logInObj.cmd = 'login';
	logInObj.usr = 'gc001';
	logInObj.pwd = '000000';
	
	client.subscribe(logInTopic + logInObj.usr);
	console.log(logInTopic + logInObj.usr);
	var msg = new Paho.MQTT.Message(JSON.stringify(logInObj));
    msg.destinationName = logInTopic + logInObj.usr;
	client.send(msg);
    //client.disconnect();
};

function onConnect() {
	logIn();
    //console.log("onConnect");
	/*
    var obj = {};
    obj.cmd = 'signup';
    obj.usr = 'gc01';
    obj.pwd = '000000';

    var str = JSON.stringify(obj);
    //console.log(str);

    var topic = 'myim/chat/room/gc001';
    client.subscribe(topic);
    var message = new Paho.MQTT.Message(str);
    message.destinationName = topic;
    for (var i = 0; i < 100; i++) {
        client.send(message);
    }
    client.disconnect();
	*/
};

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
};

// called when a message arrives
function onMessageArrived(message) {
    //console.log("onMessageArrived:"+message.payloadString);
	var arvObj = JSON.parse(message.payloadString);
    console.log(arvObj);
};