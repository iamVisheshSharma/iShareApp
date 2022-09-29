import express from "express";
import File from "../models/file.js";
import dotenv from 'dotenv';

dotenv.config();

const route =  express.Router();

route.get('/:uuid', async (req, res) => {
    const file =  await File.findOne({ uuid: req.params.uuid });
    if(!file){
        res.send("Link is expired....");
    }
    res.send({"success": "true", "link": `${process.env.APP_BASE_URL}/file/download/${file.uuid}`});
});

export default route;
