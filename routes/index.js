#!/usr/bin/env node
'use strict';
/*
 * index.js
 * create by gc87
 */

var user = require('./user');
var checkin = require('./checkin');
var contact = require('./contact');
var room = require('./room');

//客户注册登录等功能的topic处理函数
exports.user = user.main;

//客户签到（checkin）的主要处理函数
exports.checkin = checkin.main;

//客户通讯录(contacts)的主要处理函数
exports.contact = contact.main;

//客户创建的聊天室（room）的主要处理函数
exports.room = room.main;

