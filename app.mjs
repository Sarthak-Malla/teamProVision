import './config.mjs'

import express from 'express'
import session from 'express-session';
import path from 'path'
import { fileURLToPath } from 'url';

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

app.get('/', (req, res) => {
    // TODO: If the user is already logged in, redirect to their dashboard
    // else redirect to register/login page
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3000);
