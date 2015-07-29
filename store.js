/*
 * store.js
 */

function Store(mongoose){
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var MQTTOptionSchema = new Schema({
		host			: {type: String, default: 'localhost'},
		port			: {type: String, default: '1883'},
		keepalive		: {type: Number, default: 10},
		clientId		: {type: String, default: 'node_system'},
		protocolId		: {type: String, default: 'MQTT'},
		protocolVersion	: {type: Number, default: 4},
		clean			: {type: Boolean, default: true},
		reconnectPeriod	: {type: Number, default: 1000},
		connectTimeout	: {type: Number, default: 30 * 1000}
	}, {collection: 'mqttoption'});

	var SysUserSchema = new Schema({
		usr		: {type: String, unique: true},
		pwd		: {type: String},
		enable	: {type: Boolean}
	}, {collection: 'sysuser'});

	var SysTopicSchema = new Schema({
		name	: {type: String, unique: true},
		topic	: {type: String},
		qos		: {type: Number},
		explain	: {type: String},
		date	: {type: Date, default: Date.now}
	}, {collection: 'systopic'});

	var CheckInSchema = new Schema({
		srcUsrId	: {type: ObjectId},
		tagUsrId	: {type: ObjectId},
		topic		: {type: String, unique: true},
		enable		: {type: Boolean},
		date		: {type: Date, default: Date.now}
	}, {collection: 'checkin'});


	var MQTTOption = mongoose.model('MQTTOption', MQTTOptionSchema);
	var SysUser = mongoose.model('SysUser', SysUserSchema);
	var SysTopic = mongoose.model('SysTopic', SysTopicSchema);
	var CheckIn = mongoose.model('CheckIn', CheckInSchema);

	//初始化option
	var option = new MQTTOption();
	option.keepalive = 10;
	option.clientId = 'node_system';
	option.protocolId = 'MQTT';
	option.protocolVersion = 4;
	option.clean = true;
	option.reconnectPeriod = 1000;
	option.connectTimeout = 30 * 1000;
	option.save();

	//初始化topic
	var topic = new SysTopic();
	topic.name = 'checkin';
	topic.topic = 'myim/chat/checkin/+';
	topic.qos = 0;
	explain = 'topic of checkin.';
	topic.save();

	topic = new SysTopic();
	topic.name = 'contact';
	topic.topic = 'myim/chat/contact/+';
	topic.qos = 2;
	explain = 'topic of contact.';
	topic.save();

	topic = new SysTopic();
	topic.name = 'room';
	topic.topic = 'myim/chat/room/+';
	topic.explain = 'topic of room.';
	topic.qos = 2;
	topic.save();

	//初始化系统用户sysuser
	var user = new SysUser();
	user.usr = 'system';
	user.pwd = '000000';
	user.enable = true;
	user.save();

	//
	this.getMQTTOptionModel = function(){
		return MQTTOption;
	};

	this.getSysUserModel = function(){
		return SysUser;
	};

	this.getSysTopicModel = function(){
		return SysTopic;
	};

	this.getCheckInModel = function(){
		return CheckIn;
	};
};

module.exports = Store;
