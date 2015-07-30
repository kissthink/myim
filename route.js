/*
 * route.js
 */

function Route(){
};

//客户签到（checkin）的主要处理函数
Route.prototype.checkin = function(usr, msg, packet) {
};

//客户通讯录(contacts)的主要处理函数
Route.prototype.contact = function(usr, msg, packet) {
};

//客户创建的聊天室（room）的主要处理函数
Route.prototype.room = function(usr, msg, packet) {
};

module.exports = Route;
