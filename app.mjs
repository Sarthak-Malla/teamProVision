import './config.mjs'
import './db.mjs'

import express from 'express'
import session from 'express-session';
import path from 'path'
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';

import { randomUUID } from 'crypto';

const User = mongoose.model('User');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

// express session
const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
};
app.use(session(sessionOptions));

// home page
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// register page
app.get('/register', (req, res) => {
    // TODO: If the user is already logged in, redirect to their dashboard
    // else redirect to register/login page
    res.render('register', { error: req.session.registerError });
    req.session.registerError = null;
});
app.post('/register', async (req, res) => {
    // before registering the user, we need to check if the username is already taken
    const username_ = req.body.username;
    const password_ = req.body.password;
    const team_leader_ = req.body.isLeader == 'on' ? true : false;

    const foundUser = await User.findOne({ username: username_, hash: password_ });
    if (foundUser) {
        req.session.registerError = 'Username already taken';
        res.redirect('/register');
    } else {
        const newUser = new User({
            userID: randomUUID(),
            username: username_,
            hash: password_,
            team_leader: team_leader_,
            projects: [],
            tasks: []
        });
        const savedUser = await newUser.save();

        req.session.user = savedUser.userID;

        res.redirect('/dashboard');
    }
});

//login page
app.get('/login', (req, res) => {
    res.render('login', { error: req.session.loginError });
    req.session.loginError = null;
});
app.post('/login', async (req, res) => {
    const username_ = req.body.username;
    const password_ = req.body.password;

    const foundUser = await User.findOne({ username: username_, hash: password_ });
    if (foundUser) {
        req.session.user = foundUser.userID;
        res.redirect('/dashboard');
    } else {
        req.session.loginError = 'Invalid username or password';
        res.redirect('/login');
    }
});

app.listen(process.env.PORT || 3000);
