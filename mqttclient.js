var mqtt = require('mqtt');

var clientId = 'mqttjs_client_0'; 
var usr = 'gc87';
var pwd = '000000';

var options = {
	host: 'localhost',
	port: '1883',
	keepalive: 10000,
	clientId: clientId
};

var client = mqtt.connect('ws://test.mosquitto.org:8080');
//var client = mqtt.connect('mqtt://localhost:1883');
var chatTopic = 'myim/chat/checkin/' + usr;

function onConnect(flag){
	var obj = {};
	obj.cmd = flag;
	obj.clientId = options.clientId;
	obj.usr = usr;
	obj.pwd = pwd;
	var str = JSON.stringify(obj); 

	client.subscribe(chatTopic, {qos: 2});
	client.publish(chatTopic, str, {qos: 2}, function(err, granted){
		if(err){
			console.log(err.toString());
			return;
		}
	});
	//client.unsubscribe(chatTopic);
};

function userTest(){
	var signUpTopic = 'myim/chat/user/' + usr;
	var obj = {};
	obj.cmd = 'signup';
	obj.usr = 'gc01';
	obj.pwd = '000000'

	client.subscribe(signUpTopic, {qos: 2});
	client.publish(signUpTopic, JSON.stringify(obj), {qos: 2}, function(err, granted){
		if(err){
			console.log(err.toString());
			return;
		}
	});
};

client.on('connect', function() {
	//onConnect('connect');
	userTest();
});

client.on('reconnect', function(){
	onConnect('reconnect');
});

client.on('close', function(){
	client.unsubscribe(chatTopic);
});

client.on('offline', function(){
});

client.on('error', function(err){
});

client.on('message', function(topic, message, packet) {
	//需要过滤掉本客户端的topic
	/*
	if(!chatTopic === topic){
		console.log(message.toString());
		console.log(packet);
	}
	*/
	console.log(message.toString());
	var obj = JSON.parse(message.toString());
	if('re_signup' == obj.cmd){
		var o = {};
		o.cmd = 'login';
		o.usr = 'gc01';
		o.pwd = '000000';
		var signUpTopic = 'myim/chat/user/' + usr;
		client.publish(signUpTopic, JSON.stringify(o), {qos: 2});
	}
});
