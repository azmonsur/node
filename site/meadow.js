//Express server
'use strict'

//create app
var express = require('express');
var app = express();

//import self defined module(s)
var fortune = require('./lib/fortune.js')

//set up handlebars view engine - handles HTML
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);


//set up static files directory
app.use(express.static(__dirname + '/public'));

//homepage route
app.get('/', function (req, res) {
    res.render('home');
});

//about page route
app.get('/about', function (req, res) {
    res.render('about', {fortune: fortune.getFortune()});
});


//custom 404 page
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

//custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

//listening port
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate...')
})  