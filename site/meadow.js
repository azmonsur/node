//Express server
'use strict';

//create app, import express
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

//middleware for handling file upload
var formidable = require('formidable');

//middleware for JQuery file upload
var jqupload = require('jquery-file-upload-middleware');

//import self defined module(s)
var fortune = require('./lib/fortune.js');
var weatherData = require('./lib/weather-data.js');
var credentials = require('./lib/credentials.js');

//import middleware for handling form body
app.use(require('body-parser')());

//import middleware for handling cookies
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
/*res.cookie('monster', 'nom nom');
res.cookie('signed_monster', 'nom nom', { signed: true });

//retrive cookie
var monster = req.cookies.monster;
var signedMonster = req.signedCookies.monster;
console.log(monster, signedMonster);*/

//delete cookie
//res.clearCookie('monster');

//set up handlebars view engine - handles HTML, import handlebars
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine); ``
app.set('view engine', 'handlebars');

//set up static files directory
app.use(express.static(__dirname + '/public'));

//page testing with mocha
app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

//middleware to inject data
app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weatherData.getWeatherData();
    next();
});

//flash message
app.use(function (req, res, next) {
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

/*-----------------------------Defining route----------------------- */

//routes homepage, app.get()
app.get('/', function (req, res) {
    res.render('home');
});

//routes robots, app.get()
app.get('/robots', function (req, res) {
    res.type('text/plain');
    res.render('partials/robots');
});

//routes about page, app.get()`
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
    if (req.query.email && req.query.name && req.query.groupSize) { }
    res.render('tours/hood-river',
        {
            email: req.query.email,
            name: req.query.name,
            groupSize: req.query.groupSize,
            emailLabel: 'Email',
            nameLabel: 'Name',
            sizeLabel: 'Group Size'
        }
    );
});

//routes request group page, app.get()
app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});

//routes for newsletter
//get method
app.get('/newsletter', function (req, res) {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

//newsletter form handling
app.post('/newsletter', function (req, res) {
    var name = req.body.name || '', email = req.body.email || '';
    // input validation
    if (!email.match('[a-zA-Z]+@{1}gmail\.com')) {
        if (req.xhr) return res.json({ error: 'Invalid name email address.' });
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid.',
        };
        return res.redirect(303, '/newsletter/archive');
    }
    new NewsletterSignup({ name: name, email: email }).save(function (err) {
        if (err) {
            if (req.xhr) return res.json({ err: 'Database error.' });
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.'
            }
            return res.redirect(303, '/newsletter/archive');
        }
        if (req.xhr) return res.json({ success: true });
        req.session.flash = {
            type: 'success',
            intro: 'Thank you!',
            message: 'You have now been signed up for the newsletter.',
        };
        return res.redirect(303, '/newsletter/archive');
    });
});


//form handling, post method
app.post('/process', function (req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you?name=' + req.body.name);
});

//route to thank-you view
app.get('/thank-you', function (req, res) {
    res.render('thank-you', { name: req.query.name });
});

//ajax form handling
app.post('/process', function (req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you?name=' + req.body.name);
    }
});

//route for file upload
app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    });
});

//form handling for file type
app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        console.log(req.param.year);
        console.log(req.params.month);
        res.redirect(303, '/thank-you');
    });
});

//j-query file upload
app.use('/upload', function (req, res, next) {
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function () {
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function () {
            return '/uploads/' + now;
        },
    })(req, res, next);
});


//Error handling--------------------------------------------
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

if (app.thing == null) console.log('bleat!');

//listening at port
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate...');
});