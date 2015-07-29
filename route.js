/*
 * route.js
 */

function Route(){

	this.checkin = function(usr, msg, packet){
		console.log(usr);
		console.log(msg.toString());
	};

	this.contact = function(usr, msg, packet){
	};

	this.room = function(usr, msg, packet){
	};
};

module.exports = Route;
