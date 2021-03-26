import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));
} else app.use(morgan('dev'));

app.get('/', (_, res) => res.json({ msg: 'Hello World!' }));
app.post('/', (req, res) => res.json({ body: req.body }));

app.listen(port, () => console.log(`Server is runing on port ${port}...`));
