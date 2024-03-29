#!/usr/bin/env node
'use strict';
/*
 * user.js
 * create by gc87
 */

exports.main = function(packet, context) {
    var topic = packet.topic;
    var obj = JSON.parse(packet.payload);
    //如果是自己的clientId就忽略
    //if(context.config.mqtt.clientId == obj.clientId) return;

    if ('' === obj.cmd) return;
    if ('signup' == obj.cmd) {
        signUp(topic, obj, context);
        return;
    }
    if ('login' == obj.cmd) {
        logIn(topic, obj, context);
    }
    if ('logout' == obj.cmd) {
        logOut(topic, obj, context);
    }
};

/*
 * 用户注册im系统
 */
function signUp(topic, obj, context) {
    var reObj = {};
    reObj.cmd = 're_signup';
    reObj.clientid = context.config.mqtt.clientId;
    if ('' === obj.usr) {
        reObj.code = 2001;
        context.client.publish(topic, JSON.stringify(reObj));
        return;
    }
    if (context.config.sysuser.usr == obj.usr) {
        reObj.code = 2002;
        context.client.publish(topic, JSON.stringify(reObj));
        return;
    }

    var User = context.store.getUserModel();
	User.find( {'usr': obj.usr}, 'usr pwd', function(err, usr) {
        if (err) { //查询错误
            reObj.code = 2005;
            console.log(err);
        }
        if (0 == usr.length) { //不存在,则创建
            var user = new User();
            user.usr = obj.usr;
            user.pwd = obj.pwd;
            user.save();
            reObj.code = 2000;
        }
        if (0 < usr.length) { //已存在
            reObj.code = 2002;
        }
        context.client.publish(topic, JSON.stringify(reObj));
    });
};

/*
 * 用户登录im系统
 */
function logIn(topic, obj, context) {
	var reObj = {};
	reObj.cmd = 're_login';
    var User = context.store.getUserModel();
	User.find( {'usr': obj.usr}, 'usr pwd', function(err, usr) {
        if (err) { //查询错误
            reObj.code = 2005;
            console.log(err);
        }
        if (0 < usr.length) { //已存在
            reObj.code = 2000;
			reObj.room = 'room';
			
			var roomObj = {};
			roomObj.cmd = 'sys_msg';
			roomObj.code = 3000;
			roomObj.usr = context.config.sysuser.usr;
			roomObj.msg = obj.usr + ' join this room.';
			context.client.publish('myim/chat/room/+', roomObj);
        }
		if(0 == usr.length){ //不存在
			reObj.code = 2001;
		}
        context.client.publish(topic, JSON.stringify(reObj));
		console.log(JSON.stringify(reObj));
    });
};

/*
 * 用户登出im系统
 */
function logOut(topic, obj, context) {
    //TODO:
};
