import express from 'express';
import mongoose from 'mongoose';

import { randomUUID } from 'crypto';

const User = mongoose.model('User');
const Project = mongoose.model('Project');

let router = express.Router();

router.get('/:username/createProject', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    res.render('createProject');
});

router.post('/:username/createProject', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // TODO: parse the projectMembers to create an array of UserIDs of the members
    // this gives us an array of usernames
    const projectMembers = req.body.projectMembers.split(',').map(member => member.trim());
    // we fetch the user data of the members
    const memberIDs = await User.find({ username: { $in: projectMembers } });

    const project = new Project({
        projectID: randomUUID(),
        user: req.session.user,
        name: req.body.projectName,
        description: req.body.projectDescription,
        creator: req.session.user,
        tasks: [],
        startedAt: new Date(req.body.projectStartDate),
        deadline: new Date(req.body.projectDueDate),
        members: [req.session.user, ...memberIDs],
        leader: req.session.user
    });

    // TODO: save the project to the database
    const savedProject = await project.save();

    // TODO: Find the members and add the project to their projects array
    memberIDs.map(async (member) => {
        const foundUser = await User.findOne({ userID: member.userID });
        foundUser.projects.push(savedProject);
        await foundUser.save();
    });
    // TODO: Add the project to the user's projects array in the database
    const user = await User.findOne({ userID: req.session.user.userID });
    user.projects.push(savedProject);
    await user.save();

    res.redirect(`/${req.session.user.username}/dashboard`);
});

export const createProjectRoute = router;