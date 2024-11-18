var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import express-handlebars
const { engine } = require('express-handlebars'); // Newer syntax for express-handlebars
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sendResumeRouter = require('./routes/sendResume');
var app = express();

// View engine setup
app.engine('hbs', engine({  // Use 'engine' from express-handlebars
  extname: 'hbs',           // File extension for templates
  defaultLayout: 'main',    // Default layout template
  layoutsDir: path.join(__dirname, 'views/layouts'), // Path to layout templates
  partialsDir: path.join(__dirname, 'views/partials') // Path to partials (optional)
}));
app.set('views', path.join(__dirname, 'views')); // Views directory
app.set('view engine', 'hbs'); // Set Handlebars as the view engine


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/send-resume', sendResumeRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
  