import express from 'express';
import mongoose from 'mongoose';

const User = mongoose.model('User');

let router = express.Router();

router.get('/:username/dashboard', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    }

    // TODO: fetch the projects and tasks of the user from the database
    // and pass them to the dashboard page
    const user = await User.findOne({ userID: req.session.user.userID }).populate('projects').populate('tasks');

    const user_info = {
        username: req.session.user.username,
        team_leader: req.session.user.team_leader
    };

    res.render('dashboard', { user: user_info, projects: user.projects, tasks: user.tasks });
});

export const dashboardRoute = router;