import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    // TODO: If the user is already logged in, redirect to their dashboard
    // else redirect to register/login page
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3000);
