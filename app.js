var restify = require('restify');
var config = require('./config');
var app = restify.createServer({name:'victor'});

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.set('port', (process.env.PORT || config.port));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
var routes = require('./routes')(app);
var passport = require('./passport')(app);

