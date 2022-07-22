import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import upload from './routes/uploadFile.js';
import download from './routes/download.js';
import show from './routes/show.js'

connectDB();
dotenv.config();

const app = express();

app.use(express.json());

app.use('/ushare', upload);
app.use('/file/download', download);
app.use('/file', show);

app.listen(process.env.PORT, () => console.log(`Server running on port http://localhost:${process.env.PORT}`));