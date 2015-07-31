/*
 * route.js
 */


//客户签到（checkin）的主要处理函数
exports.checkin = function(packet, mongoose) {
	console.log(packet.payload.toString());
};

//客户通讯录(contacts)的主要处理函数
exports.contact = function(packet, mongoose) {
};

//客户创建的聊天室（room）的主要处理函数
exports.room = function(packet, mongoose) {
};

