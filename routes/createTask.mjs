import express from 'express';
import mongoose from 'mongoose';

import { randomUUID } from 'crypto';

const User = mongoose.model('User');
const Project = mongoose.model('Project');
const Task = mongoose.model('Task');

let router = express.Router();

router.get('/:username/createTask', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    // TODO: fetch the projects of the user from the database
    // and pass them to the createTask page
    
    // grab all the ObjectID reference of the projects
    const projectIDs = req.session.user.projects;

    // get all the projects from the database
    const projects = await Project.find({ _id: { $in: projectIDs } });

    res.render('createTask', { projects });
});

router.post('/:username/createTask', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // TODO: parse the taskMembers to create an array of UserIDs of the members
    // this gives us an array of usernames
    const taskMembers = req.body.taskMembers.split(',').map(member => member.trim());
    // we fetch the user data of the members
    const memberIDs = await User.find({ username: { $in: taskMembers } });

    // TODO: parse the taskProject which has the projectID of the project
    // we fetch the project data of the project
    const projectID = req.body.taskProject;
    const project = await Project.findOne({ projectID: projectID });

    const task = new Task({
        taskID: randomUUID(),
        user: req.session.user,
        name: req.body.taskName,
        description: req.body.taskDescription,
        startedAt: new Date(req.body.taskStartDate),
        deadline: new Date(req.body.taskDueDate),
        status: req.body.taskStatus,
        members: [req.session.user, ...memberIDs],
        project: project
    });

    // TODO: save the task to the database
    const savedTask = await task.save();

    // TODO: Find the members and add the task to their tasks array
    memberIDs.map(async (member) => {
        const foundUser = await User.findOne({ userID: member.userID });
        foundUser.tasks.push(savedTask);
        await foundUser.save();
    });
    // TODO: Add the task to the user's tasks array in the database
    const user = await User.findOne({ userID: req.session.user.userID });
    user.tasks.push(savedTask);
    await user.save();

    // TODO: Add the task to the project's tasks array in the database
    project.tasks.push(savedTask);
    await project.save();

    console.log(task);

    res.redirect(`/${req.session.user.username}/dashboard`);
});

export const createTaskRoute = router;