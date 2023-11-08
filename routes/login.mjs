import express from 'express';
import mongoose from 'mongoose';

const User = mongoose.model('User');

let router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { error: req.session.loginError });
    req.session.loginError = null;
});

router.post('/login', async (req, res) => {
    const username_ = req.body.username;
    const password_ = req.body.password;

    const foundUser = await User.findOne({ username: username_, hash: password_ });
    if (foundUser) {
        req.session.user = foundUser;
        res.redirect(`/${foundUser.username}/dashboard`);
    } else {
        req.session.loginError = 'Invalid username or password';
        res.redirect('/login');
    }
});

export const loginRoute = router;