var userTopic = 'myim/chat/user/';
var roomTopic = 'myim/chat/room/';
var client;
var usr = '';
var clientStatus = '';

function getRandomNum(Min,Max) {   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return(Min + Math.round(Rand * Range));   
}   

$(function() {
	//mqtt client 连接
    client = new Paho.MQTT.Client('test.mosquitto.org', 8080, "clientId" + getRandomNum(1, 100000));
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
	client.connect( {onSuccess:onConnect});
	
	$('#event').on('signup', eventSignUp);
	$('#event').on('login', eventLogIn);
	$('#event').on('logined', eventLogIned);
	
	$('#loginDiv').show();
	$('#chatDiv').hide();
	$('#inputDiv').hide();
	
	
	$(window).resize(function reSize(){
		//获取浏览器的宽度
		var w = $(window).width();
		var h = $(window).height();
		
		$('#chatDiv').width(w -22);
		$('#chatDiv').height(h -80);
		$('#inputDiv').width(w -20);
		$('#input').width(w - 20 - 100);
		$('#loginDiv').css('margin-top', (h / 2) - ($('#loginDiv').height() / 2));
	});
	
	$(window).trigger('resize'); //页面加载的时候触发resize事件
	$('#nickname').focus();
	$('#nickname').keyup(function(e){
		if('connected' === clientStatus && '' !== $('#nickname').val() && 13 == e.keyCode) {
			usr = $('#nickname').val();
			logIn(usr, '000000');
		}
	});
	
	$('#inputBtn').click(function(){
		if('' !== $('#input').val()) {
			var txt = $('#input').val();
			var obj = {};
			obj.cmd = 'room';
			obj.usr = usr;
			obj.msg = txt;
			var msg = new Paho.MQTT.Message(JSON.stringify(obj));
			msg.destinationName = roomTopic + usr;
			client.send(msg);
			$('#input').val('');	
		}
	});
	
	$('#input').keyup(function(e){
		if(13 == e.keyCode) {
			$('#inputBtn').trigger('click');
		}
	});
});

function eventSignUp() {
	var nickname = $('#nickname').val();
	signUp(nickname, '000000');
};

function eventLogIn() {
	var nickname = $('#nickname').val();
	logIn(nickname, '000000');
};

function eventLogIned() {
	var nickname = $('#nickname').val();
	var usr = nickname;
	client.subscribe(roomTopic + '+', {qos: 2});
	console.log('user logined and subscribed topic: ' + roomTopic + '+');
	$('#loginDiv').hide();
	$('#chatDiv').show();
	$('#inputDiv').show();
	$('#input').focus();
	$(window).trigger('resize'); //页面加载的时候触发resize事件	
};

function logIn(usr, pwd){
	var logInTopic = userTopic;
	var logInObj = {};
	logInObj.cmd = 'login';
	logInObj.usr = usr;
	logInObj.pwd = pwd;
	
	client.subscribe(logInTopic + logInObj.usr, {qos: 2});
	var msg = new Paho.MQTT.Message(JSON.stringify(logInObj));
    msg.destinationName = logInTopic + logInObj.usr;
	client.send(msg);
    //client.disconnect();
};

function signUp(usr, pwd) {
	var signUpTopic = userTopic;
	var obj = {};
	obj.cmd = 'signup';
	obj.usr = usr;
	obj.pwd = pwd;
	
	//client.subscribe(signUpTopic + obj.usr, {qos: 2});
	var msg = new Paho.MQTT.Message(JSON.stringify(obj));
    msg.destinationName = signUpTopic + obj.usr;
	client.send(msg);
};

function onConnect() {
	clientStatus = 'connected';
	console.log('connect sucessed.');
};

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
};

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
	var arvObj = JSON.parse(message.payloadString);
    console.log(message);
	if('re_login' === arvObj.cmd && 2001 === arvObj.code){
		$('#event').trigger('signup');
	}
	
	if('re_login' === arvObj.cmd && 2000 === arvObj.code) {
		$('#event').trigger('logined'); //触发登录成功的事件
	}
	
	if('re_signup' === arvObj.cmd && 2000 === arvObj.code){
		$('#event').trigger('login');
	}
	
	if('room' === arvObj.cmd) {
		var chat = '<div class="chat">' + arvObj.usr + ' : ' + arvObj.msg + '</div>'
		$('#chatDiv').append(chat);
	}
};