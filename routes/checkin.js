#!/usr/bin/env node
'use strict';
/*
 * checkin.js
 * create by gc87
 */

exports.main = function(packet, mongoose) {
	console.log(packet.payload.toString());
	var obj = JSON.parse(packet.payload);
	console.log(obj.cmd);
};
