import express from "express";
import path from 'path';
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import File from '../models/file.js'
import sendMail from '../services/emailService.js'
import emailTemplate from '../services/emailTemplate.js'

let storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'upload/'),
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(Math.random) * 1E9}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	}
});

let upload = multer({
	storage,
	limits: { fieldSize: 1000000 * 100 }
}).single('myfile');

const router = express.Router();

router.post('/files', (req, res) => {

	//Store file
	upload(req, res, async (err) => {

		//Validate request
		if (!req.file) {
			return res.json({ error: "Something wrong...." });
		}

		if (err) {
			return res.status(500).send({ error: err.message });
		}

		//Store data in database
		const file = new File({
			filename: req.file.filename,
			uuid: uuidv4(),
			path: req.file.path,
			size: req.file.size
		});
		const response = await file.save();
		res.json({ file: `${process.env.APP_BASE_URL}/file/download/${response.uuid}` });
	});
})

router.post('/send', async (req, res) => {
	// Validate Request
	console.log(req.body);
	const { uuid, emailTo, emailFrom } = req.body;
	if(!uuid || !emailTo || !emailFrom){
		return res.status(422).send({error: "All fields are required."})
	}

	const file = await File.findOne({ uuid: uuid })
	if(file.sender){
		return res.status(422).send({error: "Email is send already."})
	}

	file.sender = emailFrom;
	file.receiver = emailTo;
	const response = await file.save();

	// Send Email
	sendMail({
		from: emailFrom,
		to: emailTo,
		subject: "uShare file sharing",
		text: `${emailFrom} shared a file with you!`,
		html: emailTemplate({
			emailFrom: emailFrom, 
			downloadLink: `${process.env.APP_BASE_URL}/file/download/${file.uuid}`, 
			size: `${parseInt(file.size/1000)} KB`, 
			expires: '24 hours'})
	});
	return res.send({success: true, msg:`Email is send to ${emailTo}`})
})

export default router;