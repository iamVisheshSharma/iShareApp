import express from "express";
import { fileURLToPath } from "url";
import { dirname } from 'path';
import File from "../models/file.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/:uuid', async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if(!file){
        res.send({"error": "File doesn't exist....."});
    }
    var filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
});

export default router;