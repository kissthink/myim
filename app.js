/**
 *	Modele dependencies
 */

var express = require('express');
var routers = require('./routes');

var app = express();

app.locals.title = 'myIM';
app.locals.email = 'sfme@qq.com';

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', routers.index);


app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' 
		+ app.get('port') + ';press Ctrl-C to terminate');
});
