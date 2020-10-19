//Express server
'use strict';

//create app, import express
var express = require('express');
var app = express();

//create app, import express
app.set('port', process.env.PORT || 3000);

//listening at port
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + ' at ' + app.get('env') + ' environment; press Ctrl-C to terminate...');
});


function startServer() {
    //create app, import express
    var express = require('express');
    var app = express();
    //create app, import express
    app.set('port', process.env.PORT || 3000);

    //listening at port
    app.listen(app.get('port'), function () {
        console.log('Express started on http://localhost:' + app.get('port') + ' at ' + app.get('env') + ' environment; press Ctrl-C to terminate...');
    });
}

if (require.main === module) {
    // application run directly; start app server
    console.log('[EXPRESS STARTED FROM MAIN]')
    //startServer();
} else {
    // application imported as a module via "require": export function
    // to create server
    module.exports = startServer;
    console.log('[EXPRESS STARTED FROM CLUSTER]')
}

//worker or master?  
/*
app.use(function (req, res, next) {
    var cluster = require('cluster');
    if (cluster.isWorker) console.log('Worker %d received request',
        cluster.worker.id);
});
*/

//middleware for handling file upload
var formidable = require('formidable');

//middleware for  JQuery file uploa
var jqupload = require('jquery-file-upload-middleware');

//import self defined module(s)
var fortune = require('./lib/fortune.js');
var weatherData = require('./lib/weather-data.js');
var credentials = require('./lib/credentials.js');
var isFound = require('./lib/drive-detector.js');

//import middleware for handling form body
app.use(require('body-parser')());

// // //email server
// // var nodemailer = require('nodemailer');

// // var mailTransport = nodemailer.createTransport('SMTP', {
// //     host: 'smtp.meadowlarktravel.com',
// //     secureConnection: true, // use SSL
// //     port: 465,
// //     auth: {
// //         user: credentials.meadowlarkSmtp.user,
// //         pass: credentials.meadowlarkSmtp.password,
// //     }
// // });

// // //send mail
// // mailTransport.sendMail({
// //     from: '"Meadowlark Travel" <info@meadowlarktravel.com>',
// //     to: 'joecustomer@gmail.com',
// //     subject: 'Your Meadowlark Travel Tour',
// //     text: 'Thank you for booking your trip with Meadowlark Travel. ' +
// //         'We look forward to your visit!',
// // }, function (err) {
// //     if (err) console.error('Unable to send email: ' + error);
// // });

//uncaught exception, domains
app.use(function (req, res, next) {
    // create a domain for this request
    var domain = require('domain').create();
    // handle errors on this domain
    domain.on('error', function (err) {
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(function () {
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);
            // disconnect from the cluster
            var worker = require('cluster').worker;
            if (worker) worker.disconnect();
            // stop taking new requests
            server.close();
            try {
                // attempt to use Express error route
                next(err);
            } catch (err) {
                // if Express error route failed, try
                // plain Node response
                console.error('Express error mechanism failed.\n', err.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch (err) {
            console.error('Unable to send 500 response.\n', err.stack);
        }
    });
    // add the request and response objects to the domain
    domain.add(req);
    domain.add(res);
    // execute the rest of the request chain in the domain
    domain.run(next);
});

// // other middleware and routes go here
// var server = http.createServer(app).listen(app.get('port'), function () {
//     console.log('Listening on port %d.', app.get('port'));
// });


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

//middleware to inject data, from weatherview
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

//environment set up
switch (app.get('env')) {
    case 'development':
        // compact, colorful dev logging
        app.use(require('morgan')('dev'));
        console.log('Running mode: DEV_MODE');
        break;
    case 'production':
        // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));
        console.log('Running mode: PROD_MODE');
        break;
}

/*-----------------------------Defining route----------------------- */

//routes homepage, app.get()
app.get('/', function (req, res) {
    res.render('home');
});

//routes for exception
app.get('/fail', function (req, res) {
    throw new Error('Nope!');
});

//routes drive checker, 
//routes homepage, app.get()
app.get('/check-drive', function (req, res) {
    res.render('check-drive', {
        driveState: 'd'
    });
});

//routes robots, app.get()
app.get('/robots', function (req, res) {
    res.type('text/plain');
    res.render('layouts/robots',
        { layout: 'robots' });
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

//newsletter form handling, (posted to newsletter)
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
        return res.redirect(303, '/newsletter');
    }
    // new NewsletterSignup({ name: name, email: email }).save(function (err) {
    //     if (err) {
    //         if (req.xhr) return res.json({ err: 'Database error.' });
    //         req.session.flash = {
    //             type: 'danger',
    //             intro: 'Database error!',
    //             message: 'There was a database error; please try again later.'
    //         }
    //         return res.redirect(303, '/newsletter/archive');
    //     }
    if (req.xhr) return res.json({ success: true });
    req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for the newsletter.',
    };
    return res.redirect(303, '/newsletter');
});



//form handling, post method for newsletter (posted to process)
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

//form handling for file type using formidable middleware
app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        fields.path = "C:\\Users\\User\\Desktop"
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
    res.status(404).render('404');
});

/*app.get('/epic-fail', function (req, res) {
    process.nextTick(function () {
        throw new Error('Kaboom!');
    });
});*/

//custom 500 page, app.use()
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


