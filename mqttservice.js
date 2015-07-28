var mqtt = require('mqtt');
var path = require('path');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var MongoClient = require('mongodb').MongoClient;

var clientId = 'node_admin'; 
var usr = 'admin';
var pwd = '000000'
var options = {
	host: 'localhost',
	port: '1883',
	keepalive: 10000,
	clientId: 'mqttjs_admin'
};

var client = mqtt.connect(options);
var mdb;
var mongoUrl = 'mongodb://localhost:27017/myim'
MongoClient.connect(mongoUrl, function(err, db){
	assert.equal(null, err);
	console.log('connected correctly to mongodb server.');
	mdb = db;
});


var checkIn = 'myim/chat/checkin/+'; //客户端签到topic
var chechInQos = 0;

var contacts = 'myim/chat/contacts/+'; //通讯录相关topic
var contactsQos = 2;

var room = 'myim/chat/room/+'; //客户端聊天室相关的topic
var roomQos = 2;

event.on('checkin', checkInCb);

event.on('contacts', contactsCb);

event.on('room', roomCb);

/* 
 * 启动时设置
 */
client.on('connect', function(packet) {
	client.subscribe(checkIn, {qos: chechInQos});
	client.subscribe(contacts, contactsQos);
	client.subscribe(room, roomQos);
});

/* 
 * 重连时设置
 */
client.on('reconnect', function(){
});

/* 
 * 关闭时清理
 */
client.on('close', function(){
	client.unsubscribe(checkIn);
	client.subscribe(contacts);
	client.subscribe(room);
});

/* 
 * 离线时处理
 */
client.on('offline', function(){
});

/* 
 * 错误处理
 */
client.on('error', function(err){
});

/* 
 * 核心事件，处理所有的topic消息，针对不同的消息类型分别处理
 */
client.on('message', function(topic, message, packet) {
	var array = topic.split(path.sep);
	if(4 < array.length) return;

	var root = array[0];
	var srv = array[1];
	var func = array[2];
	var usr = array[3];

	event.emit(func, usr, message, packet);
});

function checkInCb(usr, msg, packet){
	console.log(usr);
	console.log(msg.toString());
};

function contactsCb(usr, msg, packet){
};

function roomCb(usr, msg, packet){
};
