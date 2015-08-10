#!/usr/bin/env node
'use strict';
/*
 * store.js
 * create by gc87
 */

function Store(mongoose){
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var CheckInSchema = new Schema({
		srcUsrId	: {type: ObjectId},
		tagUsrId	: {type: ObjectId},
		topic		: {type: String, unique: true},
		enable		: {type: Boolean},
		date		: {type: Date, default: Date.now}
	}, {collection: 'checkin'});

	var UserSchema = new Schema({
		usr: {type: String, unique: true},
		pwd: {type: String}
	}, {collection: 'user'});
	
	var MessageSchema = new Schema({
		msgId: {type: String, unique: true},
		topic: {type: String},
		content: {type: String},
		msgType: {type: String}
	}, {collection: 'message'});

	var CheckIn = mongoose.model('CheckIn', CheckInSchema);
	var User = mongoose.model('User', UserSchema);
	var Message = mongoose.model('Message', MessageSchema);

	//返回客户端签到的Model
	this.getCheckInModel = function(){
		return CheckIn;
	};

	this.getUserModel = function(){
		return User;
	};
	
	this.GetMessageModel = function(){
		return Message;
	};
};

module.exports = Store;
