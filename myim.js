/*
 * myim.js
 * create by gc87
 */ 

var config = require('./config');
var mqtt = require('mqtt');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var mongoose = require('mongoose');
var Store = require('./store');
var route = require('./routes');

mongoose.connect(config.mongodb.url);
var store = new Store(mongoose);
var client = mqtt.connect(config.mqtt); //连接mqtt服务器

//数据库连接状态
mongoose.connection.on('connected', function(){
	console.log('mongoose connected to ' + config.mongodb.url);
});

//连接到MQTT服务器设置
client.on('connect', function(packet) {
	console.log('myim connected to ' + config.mqtt.host + ':' + config.mqtt.port);

	//遍历config中的topics部分，进行订阅和事件注册操作
	var topics = config.topics;
	topics.forEach(function(topic){
		//订阅config中定义的topic
		client.subscribe(topic.topic, {qos: topic.qos}, function(err, granted){
			if(!err) console.log(topic.topic + ' subscribe sucessed.');
		});

		//注册指定的topic name对应的处理时间函数
		event.on(topic.name, route[topic.name]);
	});
});

//重连时设置
client.on('reconnect', function(){
});

//关闭时清理
client.on('close', function(){
});

//离线时处理 
client.on('offline', function(){
});

//错误处理
client.on('error', function(err){
	if(err){
		console.log(err);
	}
});

//核心事件，处理所有的topic消息，针对不同的消息类型分别处理
client.on('message', function(topic, message, packet) {
	var array = topic.split(path.sep);
	if(4 < array.length) return;
	//array[2]-触发的事件名称;
	event.emit(array[2], packet, mongoose); //触发事件处理函数
});
