/*
 * store.js
 * create by gc87
 */

function Store(mongoose){
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

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


	var SysUser = mongoose.model('SysUser', SysUserSchema);
	var SysTopic = mongoose.model('SysTopic', SysTopicSchema);
	var CheckIn = mongoose.model('CheckIn', CheckInSchema);

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
