/**
 *	Modele dependencies
 */

var express = require("express");

var app = express();

app.locals.title = 'myIM';
app.locals.email = 'sfme@qq.com';

app.set('port', process.env.PORT || 3000);

app.all('/secret', function(req, res, next){
	console.log('Accessing the secret section...');
	next();
});

app.get('/', function(req, res){
	res.send('GET request to the homepage');
});

app.post('/', function(req, res){
	res.send('POST request to the homepage');
});

app.listen(3000);
