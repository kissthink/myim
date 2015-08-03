#!/usr/bin/env node
'use strict';
/*
 * user.js
 * create by gc87
 */

exports.main = function(packet, context) {
	//console.log(packet);
	var topic = packet.topic;
	var obj = JSON.parse(packet.payload);
	//如果是自己的clientId就忽略
	//if(context.config.mqtt.clientId == obj.clientId) return;

	if('' === obj.cmd) return;
	if('signup' == obj.cmd) {
		signUp(topic, obj, context);
		return;
	}
	if('login' == obj.cmd){
		logIn(topic, obj, context);
	}
	if('logout' == obj.cmd){
		logOut(topic, obj, context);
	}
};

function signUp(topic, obj, context){
	var returnObj = {};
	returnObj.cmd = 're_signup';
	returnObj.clientId = context.config.mqtt.clientId;
	if('' === obj.usr){
		returnObj.code = 2001;
	}
	context.client.publish(topic, JSON.stringify(returnObj));
};

function logIn(topic, obj, context){
};

function logOut(topic, obj, context){
};
