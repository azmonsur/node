// Downloaded/default modules
const express = require('express');                   // NodeJS framework to connect to the server and do many othrer works
const dotenv = require('dotenv');                     // For injecting secret keys/api key/passwords to the environment
const morgan = require('morgan');                     // For recording activities on webpage - used in dev mode
const path = require('path');                         // File and directory path
const mongoose = require('mongoose');                 // Database engine handler
const session = require('express-session');           // Used in conjuction with 'connect-mongo' to store session in database
const methodOverride = require('method-override');    // Override form submit method
const passport = require('passport');                 // Middleman between server and any form of authentication
const MongoStore = require('connect-mongo')(session); // To store session
const exphbs = require('express-handlebars');         // Template engine
const favicon = require('serve-favicon');             // For favicon 
const passport_fb = require('passport-facebook');
const nodemailer = require('nodemailer');


// Self-defined MODULES
const connectDB = require('./config/db');             // @desc  Handles connection to module {}

// Load dotenv config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport_google_oauth')(passport);

// Connect to MongoDB server - Must have internet connection
connectDB()

const app = express();

// Use favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Disable x-powered-by
app.disable('x-powered-by');

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // Replace POST method with whatever value that is supplied
        let method = req.body._method
        delete req.body._method
        return method
    }
}));

// Logging      Use morgan in dev mode
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags, 
        truncate,
        editIcon,
        select,
    },
    defaultLayout: 'main', 
    extname: '.hbs' 
}));
app.set('view engine', '.hbs');

// Session - Express Session
app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use( function(req, res, next) {
    res.locals.user = req.user  || null;
    next();
    console.log(res.locals.user)
})

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}...`);
})