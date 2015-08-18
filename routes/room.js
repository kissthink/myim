#!/usr/bin/env node
'use strict';
/*
 * room.js
 * create by gc87
 */

exports.main = function(packet, context){
	//var obj = JSON.parse(packet.payload);
	console.log(packet.payload.toString());
};
