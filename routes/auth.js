const express = require('express');
const router = express.Router();

module.exports = (users) => {
    // Render the login page
    router.get('/login', (req, res) => {
        const username = req.session.username;
        res.render('login',{username});
    });

    // Handle login form submission
    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            req.session.username = user.username;
            res.redirect('/');
        } else {
            res.send('Invalid username or password');
        }
    });

    // Render the register page
    router.get('/register', (req, res) => {
        const username = req.session.username;
        res.render('register',{username});
    });

    // Handle registration form submission
    router.post('/register', (req, res) => {
        const { username, password } = req.body;
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            res.send('Username already taken.');
        } else {
            users.push({ username, password });
            res.redirect('/auth/login');
        }
    });

    // Handle log out
    router.get('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.send('Error logging out');
            }
            res.redirect('/');
        });
    });

    return router;
};
