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

var client = mqtt.connect(options);
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
	var myTopic = 'myim/chat/user/' + usr;
	var obj = {};
	obj.cmd = 'signup';
	obj.usr = 'gc01';
	obj.pwd = '000000'

	client.subscribe(myTopic, {qos: 2});
	client.publish(myTopic, JSON.stringify(obj), {qos: 2}, function(err, granted){
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
	console.log(topic);
	console.log(message.toString());
});
