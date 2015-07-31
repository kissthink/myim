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

	var CheckIn = mongoose.model('CheckIn', CheckInSchema);

	//返回客户端签到的Model
	this.getCheckInModel = function(){
		return CheckIn;
	};
};

module.exports = Store;
