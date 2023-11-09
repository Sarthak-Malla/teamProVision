import './config.mjs';
import './db.mjs';

import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import { loginRoute } from './routes/login.mjs';
import { registerRoute } from './routes/register.mjs';
import { dashboardRoute } from './routes/dashboard.mjs';
import { createProjectRoute } from './routes/createProject.mjs';
import { createTaskRoute } from './routes/createTask.mjs';

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
    // you can't access someone else's dashboard
    if (req.session.user && req.url.split('/')[2] === 'dashboard' && req.url !== `/${req.session.user.username}/dashboard`) {
        res.redirect('/404');
    }
    next();
});

// home page
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// register page
app.use(registerRoute);

//login page
app.use(loginRoute);

// logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// dashboard page for user
app.use(dashboardRoute);

// create project
app.use(createProjectRoute);

// create task
app.use(createTaskRoute);


app.listen(process.env.PORT || 3000);
