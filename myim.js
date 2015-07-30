/*
 * myim.js
 * create by gc87
 */ 

var mqtt = require('mqtt');
var path = require('path');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var config = require('./config');
var mongoose = require('mongoose');
var Store = require('./store.js');
var Route = require('./route.js');

mongoose.connect(config.mongodb.url);
var store = new Store(mongoose);
var route = new Route();
var client = mqtt.connect(config.mqtt); //连接mqtt服务器

//数据库连接状态
mongoose.connection.on('connected', function(){
	console.log('mongoose connected to ' + config.mongodb.url);
});

//连接到MQTT服务器设置
client.on('connect', function(packet) {
	console.log('myim connected to ' + config.mqtt.host + ':' + config.mqtt.port);

	//从数据库中获取topic并注册topic
	var sysTopic = new store.getSysTopicModel();
	sysTopic.find(function(err, topics){
		topics.forEach(function(topic){
			client.subscribe(topic.topic, {qos: topic.qos}, function(err, granted){
				if(err){
					console.log('subscribe ' + topic.name + ' faid.');
				}
			});

			//注册myim自定义的事件处理函数
			event.on(topic.name, route[topic.name]);
		});
	});
});

//重连时设置
client.on('reconnect', function(){
});

//关闭时清理
client.on('close', function(){
	var sysTopic = new store.getSysTopicModel();
	sysTopic.find(function(err, topics){
		topics.forEach(function(topic){
			client.unsubscribe(topic.topic);
		});
	});
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
	//array[2]-function;array[3]-user
	event.emit(array[2], array[3], message, packet); //触发事件处理函数
});
