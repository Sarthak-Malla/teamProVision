import express from 'express';
import mongoose from 'mongoose';

import { randomUUID } from 'crypto';

const User = mongoose.model('User');

let router = express.Router();

router.get('/register', (req, res) => {
    // TODO: If the user is already logged in, redirect to their dashboard
    // else redirect to register/login page
    res.render('register', { error: req.session.registerError });
    req.session.registerError = null;
});

router.post('/register', async (req, res) => {
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

        req.session.user = savedUser;

        res.redirect(`/${savedUser.username}/dashboard`);
    }
});

export const registerRoute = router;