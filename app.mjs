import './config.mjs';
import './db.mjs';

import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';

import { randomUUID } from 'crypto';

const User = mongoose.model('User');
const Project = mongoose.model('Project');
const Task = mongoose.model('Task');

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

// 404 page
app.get('/404', (req, res) => {
    res.status(404);
    res.render('page404');
});

// middleware to redirect to a 404 page
app.use((req, res, next) => {
    if (req.session.user && req.session.user.username != req.url.split('/')[1]) {
        res.redirect('/404');
    }
    next();
});

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

        req.session.user = savedUser;

        res.redirect(`/${savedUser.username}/dashboard`);
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
        req.session.user = foundUser;
        res.redirect(`/${foundUser.username}/dashboard`);
    } else {
        req.session.loginError = 'Invalid username or password';
        res.redirect('/login');
    }
});

// logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// dashboard page for user
app.get('/:username/dashboard', async (req, res) => {
    // TODO: If the user is not logged in, redirect to the login page
    if (!req.session.user) {
        return res.redirect('/');
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

// create project
app.get('/:username/createProject', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    res.render('createProject');
});
app.post('/:username/createProject', async (req, res) => {
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

// create task
app.get('/:username/createTask', async (req, res) => {
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
app.post('/:username/createTask', async (req, res) => {
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


app.listen(process.env.PORT || 3000);
