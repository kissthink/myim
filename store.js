/*
 * store.js
 */

function Store(mongoose){
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var MQTTOptionsSchema = new Schema({
		keepalive		: {type: Number, default: 10},
		clientId		: {type: String, default: 'node_sys'},
		protocolId		: {type: String, default: 'MQTT'},
		protocolVersion	: {type: Number, default: 4},
		clean			: {type: Boolean, default: true}
	});

	var SysUserSchema = new Schema({
		usr		: {type: String, unique: true},
		pwd		: {type: String},
		enable	: {type: Boolean}
	});

	var SysTopicsSchema = new Schema({
		name	: {type: String},
		topic	: {type: String},
		qos		: {type: Number},
		date	: {type: Date, default: Date.now}
	});

	var CheckInSchema = new Schema({
		srcUsrId	: {type: ObjectId},
		tagUsrId	: {type: ObjectId},
		topic		: {type: String, unique: true},
		enable		: {type: Boolean},
		date		: {type: Date, default: Date.now}
	});



	var SysUser = mongoose.model('SysUser', SysUserSchema);
	var SysTopics = mongoose.model('SysTopics', SysTopicsSchema);
	var CheckIn = mongoose.model('CheckIn', CheckInSchema);

	this.getSysUserModel = function(){
		return SysUser;
	};

	this.getSysTopicsModel = function(){
		return SysTopics;
	};

	this.getCheckInModel = function(){
		return CheckInModel;
	};
};

module.exports = Store;
