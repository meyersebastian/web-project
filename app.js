const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const app = express();

// Use session middleware with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  })
}));

// Your existing routes and middleware

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
