/*
 * myim.js
 * create by gc87
 */ 

var mqtt = require('mqtt');
var path = require('path');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var mongoose = require('mongoose');
var Store = require('./store.js');
var Route = require('./route.js');

var mongoUrl = 'mongodb://localhost:27017/myim';
mongoose.connect(mongoUrl);
var store = new Store(mongoose);
var route = new Route();

event.on('myimstart', function(){
	var mqttOption = new store.getMQTTOptionModel();
	var option = {};
	mqttOption.findOne(function(err, op){
		if(!err){
			option.host = op.host;
			option.port = op.port;
			option.keepalive = op.keepalive;
			option.clientId = op.clientId;
		}
		var client = mqtt.connect(option); //连接mqtt服务器

		//连接到MQTT服务器设置
		client.on('connect', function(packet) {
			console.log('myim connected to ' + option.host + ':' + option.port);

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

			var root = array[0];
			var srv = array[1];
			var func = array[2];
			var usr = array[3];

			event.emit(func, usr, message, packet);
		});

	});
});
event.emit('myimstart');

//数据库连接状态
mongoose.connection.on('connected', function(){
	console.log('mongoose connected to ' + mongoUrl);
});


