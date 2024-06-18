const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse the body of POST requests
app.use(bodyParser.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a secret key for your application
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// In-memory store for user data
const users = [];

// Routes
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const authRouter = require('./routes/auth')(users);
const tetrisRouter = require('./routes/tetris');  // Add this line

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/auth', authRouter);
app.use('/tetris', tetrisRouter);  // Add this line

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
