#!/usr/bin/env node
'use strict';
/*
 * checkin.js
 * create by gc87
 */

exports.main = function(packet, context) {
	console.log(packet);
	var obj = JSON.parse(packet.payload);
	if(context.config.mqtt.clientId == obj.clientId) return;
	obj.clientId = context.config.mqtt.clientId;
	context.client.publish(obj, packet.payload);
};
