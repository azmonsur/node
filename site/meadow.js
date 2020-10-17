//Express server
'use strict';

//create app, import express
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

//import self defined module(s)
var fortune = require('./lib/fortune.js');

//set up handlebars view engine - handles HTML, import handlebars
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//set up static files directory
app.use(express.static(__dirname + '/public'));

//page testing with mocha
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

/*-----------------------------Defining route----------------------- */

//routes homepage, app.get()
app.get('/', function (req, res) {
    res.render('home');
});

//routes about page, app.get()
app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

//routes contact page, app.get()
app.get('/contact', function (req, res) {
    res.render('contact');
});

//routes hood-river page, app.get()
app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});

//routes contact page, app.get()
app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});

//custom 404 page, app.use()
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

//custom 500 page, app.use()
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

if( app.thing == null ) console.log( 'bleat!' );

//listening at port
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate...');
});