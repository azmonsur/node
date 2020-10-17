//Express server

'use strict'

var express = require('express');
var app = express();

//set up handlebars view engine - handles HTML
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

//set up static files directory
app.use(express.static(__dirname + '/public'));

//dynamism, server a page dynamically
var fortunes = [
    'Conquer your fears or they will conquer you.',
    'Rivers need Springs.',
    'Do not fear what you do not know.',
    'You will have a pleasant surprise.',
    'Whenever possible, keep it simple.'
];

//homepage route
app.get('/', function (req, res) {
    res.render('home');
});

//about page route
app.get('/about', function (req, res) {
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: randomFortune});
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