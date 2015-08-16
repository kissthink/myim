var userTopic = 'myim/chat/user/';
var roomTopic = 'myim/chat/room/';
var client;

$(function() {
	/*
    client = new Paho.MQTT.Client('test.mosquitto.org', 8080, "clientId");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
	client.connect( {onSuccess:onConnect});
	*/
	
	eventSignUp = jQuery.Event('signup');
	eventLogIn = jQuery.Event('login');
	
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
	
	$('#nickname').keyup(function(e){
		if(13 == e.keyCode) {
			$('#loginDiv').hide();
			$('#chatDiv').show();
			$('#inputDiv').show();
			$(window).trigger('resize'); //页面加载的时候触发resize事件
			var nickname = $('#nickname').val();
			logIn(nickname, '000000');
		}
	});
	
	$('#inputBtn').click(function(){
		var txt = $('input').val();
		console.log(txt);
	});
});


function logIn(usr, pwd){
	var logInTopic = userTopic;
	var logInObj = {};
	logInObj.cmd = 'login';
	logInObj.usr = usr;
	logInObj.pwd = pwd;
	
	client.subscribe(logInTopic + logInObj.usr);
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
	
	client.subscribe(signUpTopic + obj.usr);
	var msg = new Paho.MQTT.Message(JSON.stringify(obj));
    msg.destinationName = signUpTopic + obj.usr;
	client.send(msg);
};

function onConnect() {
	//logIn('gc001', '000000');
	//连接成功
};

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
};

// called when a message arrives
function onMessageArrived(message) {
    //console.log("onMessageArrived:"+message.payloadString);
	var arvObj = JSON.parse(message.payloadString);
    console.log(message);
	if('re_login' === arvObj.cmd && 2001 === arvObj.code){
		signUp('gc001', '000000');
	}
	
	if('re_login' === arvObj.cmd && 2000 === arvObj.code) {
		client.subscribe(roomTopic + 'gc001');
		console.log('user logined and subscribed topic: ' + roomTopic + 'gc001');
	}
	
	if('re_signup' === arvObj.cmd && 2000 === arvObj.code){
		logIn('gc001', '000000');
	}
};